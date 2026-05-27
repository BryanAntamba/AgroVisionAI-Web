import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalesValidaciones } from '../../shared/validators/modales-validaciones';
import { AutenticacionValidaciones } from '../../shared/validators/autenticacion-validaciones';
import { CambiarPassword } from '../cambiar-password/cambiar-password';
import { CodigoVerificacion } from '../codigo-verificacion/codigo-verificacion';

@Component({
  selector: 'app-restablecer-password',
  imports: [CommonModule, ReactiveFormsModule, CodigoVerificacion, CambiarPassword],
  templateUrl: './restablecer-password.html',
  styleUrls: [
    './restablecer-password.css',
    '../../shared/styles/validacion-errores.css',
    '../../shared/styles/animaciones-autenticacion.css'
  ],
})
export class RestablecerPassword {
  resetForm: FormGroup;
  resetError = '';
  correoVerificado = '';
  paso: 'correo' | 'codigo' | 'password' | 'finalizado' = 'correo';

  readonly correoSimulado = 'usuario@gmail.com';
  validators = AutenticacionValidaciones;

  constructor(private fb: FormBuilder) {
    this.resetForm = this.fb.group({
      email: [
        '',
        [Validators.required, Validators.pattern(ModalesValidaciones.CORREO_GMAIL_PATTERN)],
      ],
    });
  }

  get emailControl() {
    return this.resetForm.get('email');
  }

  enviarCodigo(): void {
    this.resetError = '';

    if (this.resetForm.invalid) {
      this.resetForm.markAllAsTouched();
      return;
    }

    if (this.resetForm.value.email !== this.correoSimulado) {
      this.resetError = 'El correo no coincide con el usuario simulado.';
      return;
    }

    this.correoVerificado = this.resetForm.value.email;
    this.paso = 'codigo';
  }

  mostrarCambioPassword(): void {
    this.paso = 'password';
  }

  finalizarCambio(): void {
    this.paso = 'finalizado';
  }

  reenviarCodigoVerificacion(): void {
    console.log('Reenviando código de verificación a:', this.correoVerificado);
    // Aquí iría la lógica para reenviar el código al backend
  }
}
