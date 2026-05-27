import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
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
export class CodigoVerificacion {
  @Input() correo = '';
  @Output() codigoVerificado = new EventEmitter<void>();
  @Output() reenviarCodigo = new EventEmitter<void>();

  codigoForm: FormGroup;
  mensajeReenvio = '';
  intentosReenvio = 0;
  limiteReenvioAlcanzado = false;
  validators = AutenticacionValidaciones;

  constructor(private fb: FormBuilder) {
    this.codigoForm = this.fb.group({
      codigo: ['', [Validators.required, Validators.pattern(ModalesValidaciones.CODIGO_VERIFICACION_PATTERN)]],
    });
  }

  get codigoControl() {
    return this.codigoForm.get('codigo');
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
      this.mensajeReenvio = AutenticacionValidaciones.getCodigoReenvioMensaje(this.intentosReenvio);
      this.reenviarCodigo.emit();
      return;
    }

    this.limiteReenvioAlcanzado = true;
    this.mensajeReenvio = AutenticacionValidaciones.getCodigoReenvioMensaje(this.intentosReenvio + 1);
  }
}
