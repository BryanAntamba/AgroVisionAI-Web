import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalesValidaciones } from '../../shared/validators/modales-validaciones';
import { AutenticacionValidaciones } from '../../shared/validators/autenticacion-validaciones';

@Component({
  selector: 'app-codigo-verificacion',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './codigo-verificacion.html',
  styleUrls: [
    './codigo-verificacion.css',
    '../../shared/styles/validacion-errores.css',
    '../../shared/styles/animaciones-autenticacion.css'
  ],
})
export class CodigoVerificacion implements OnDestroy {
  @Input() correo = '';
  @Output() codigoVerificado = new EventEmitter<void>();
  @Output() reenviarCodigo = new EventEmitter<void>();

  codigoForm: FormGroup;
  mensajeReenvio = '';
  intentosReenvio = 0;
  limiteReenvioAlcanzado = false;
  validators = AutenticacionValidaciones;
  
  tiempoRestante = 0;
  intervaloCountdown: ReturnType<typeof setInterval> | null = null;

  constructor(private fb: FormBuilder, private cdr: ChangeDetectorRef) {
    this.codigoForm = this.fb.group({
      codigo: ['', [Validators.required, Validators.pattern(ModalesValidaciones.CODIGO_VERIFICACION_PATTERN)]],
    });
  }

  ngOnDestroy(): void {
    this.detenerCountdown();
  }

  get codigoControl() {
    return this.codigoForm.get('codigo');
  }

  get tiempoFormateado(): string {
    const minutos = Math.floor(this.tiempoRestante / 60);
    const segundos = this.tiempoRestante % 60;
    return `${minutos}:${segundos.toString().padStart(2, '0')}`;
  }

  soloNumeros(event: KeyboardEvent): void {
    if (!/^[0-9]$/.test(event.key)) {
      event.preventDefault();
    }
  }

  normalizarCodigo(): void {
    this.mensajeReenvio = '';
    this.limiteReenvioAlcanzado = false;
    const valor = String(this.codigoControl?.value ?? '')
      .replace(/\D/g, '')
      .slice(0, 6);

    this.codigoControl?.setValue(valor, { emitEvent: false });
  }

  verificarCodigo(): void {
    this.normalizarCodigo();

    if (this.codigoForm.invalid) {
      this.codigoForm.markAllAsTouched();
      return;
    }

    this.codigoVerificado.emit();
  }

  solicitarReenvio(): void {
    if (AutenticacionValidaciones.puedeReenviarCodigo(this.intentosReenvio)) {
      this.intentosReenvio++;
      this.limiteReenvioAlcanzado = false;
      this.detenerCountdown();
      this.mensajeReenvio = AutenticacionValidaciones.getCodigoReenvioMensaje(this.intentosReenvio);
      this.reenviarCodigo.emit();
      return;
    }

    this.limiteReenvioAlcanzado = true;
    this.iniciarCountdown();
  }

  private iniciarCountdown(): void {
    this.detenerCountdown();
    this.tiempoRestante = 15 * 60; // 15 minutos en segundos
    
    this.intervaloCountdown = setInterval(() => {
      this.tiempoRestante--;
      this.cdr.detectChanges(); // Forzar detección de cambios
      
      if (this.tiempoRestante <= 0) {
        this.detenerCountdown();
        this.limiteReenvioAlcanzado = false;
        this.mensajeReenvio = '';
        this.intentosReenvio = 0;
        this.cdr.detectChanges();
      }
    }, 1000);
  }

  private detenerCountdown(): void {
    if (this.intervaloCountdown) {
      clearInterval(this.intervaloCountdown);
      this.intervaloCountdown = null;
    }
  }
}
