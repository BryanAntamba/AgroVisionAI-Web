import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  HostListener,
  Input,
  forwardRef,
} from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';

@Component({
  selector: 'app-desplegable-campo',
  imports: [CommonModule],
  templateUrl: './desplegable-campo.html',
  styleUrl: './desplegable-campo.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DesplegableCampo),
      multi: true,
    },
  ],
})
export class DesplegableCampo implements ControlValueAccessor {
  @Input({ required: true }) campoId!: string;
  @Input({ required: true }) icono!: string;
  @Input({ required: true }) placeholder!: string;
  @Input({ required: true }) opciones: readonly string[] = [];

  valor = '';
  abierto = false;
  deshabilitado = false;
  private tocado = false;

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  constructor(private elementRef: ElementRef<HTMLElement>) {}

  get textoMostrado(): string {
    return this.valor || this.placeholder;
  }

  get sinSeleccion(): boolean {
    return !this.valor;
  }

  writeValue(value: string | null): void {
    this.valor = value ?? '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.deshabilitado = isDisabled;
    if (isDisabled) {
      this.abierto = false;
    }
  }

  alternar(): void {
    if (this.deshabilitado) {
      return;
    }
    this.abierto = !this.abierto;
  }

  elegir(opcion: string): void {
    this.valor = opcion;
    this.onChange(opcion);
    if (!this.tocado) {
      this.tocado = true;
      this.onTouched();
    }
    this.abierto = false;
  }

  @HostListener('document:click', ['$event'])
  cerrarAlClickExterno(event: MouseEvent): void {
    if (!this.abierto) {
      return;
    }
    if (!this.elementRef.nativeElement.contains(event.target as Node)) {
      this.abierto = false;
      // Marcar como tocado solo si se cerró sin seleccionar nada
      if (!this.tocado && !this.valor) {
        this.tocado = true;
        this.onTouched();
      }
    }
  }
}
