// Importación de módulos básicos
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

// Importación de validadores globales
import { ModalesValidaciones } from '../../shared/validators/modales-validaciones';
import { AutenticacionValidaciones } from '../../shared/validators/autenticacion-validaciones';
import { AuthService } from '../../shared/services/auth.service';

// Importación de los componentes de cada paso del proceso
import { CambiarPassword } from '../cambiar-password/cambiar-password';
import { CodigoVerificacion } from '../codigo-verificacion/codigo-verificacion';
import { PasswordConfirmacion } from '../password-confirmacion/password-confirmacion';

// Decorador con la configuración del componente
@Component({
  selector: 'app-restablecer-password',
  imports: [CommonModule, ReactiveFormsModule, CodigoVerificacion, CambiarPassword, PasswordConfirmacion],
  templateUrl: './restablecer-password.html',
  styleUrls: [
    './restablecer-password.css',
    '../../shared/validators/styles/validacion-errores.css',
    '../../shared/validators/styles/animaciones-autenticacion.css'
  ],
})
export class RestablecerPassword {
  @Output() volverLogin = new EventEmitter<void>();

  resetForm: FormGroup;
  resetError = '';
  correoVerificado = '';
  reenvioError = '';
  paso: 'correo' | 'codigo' | 'password' | 'finalizado' = 'correo';
  isLoading = false;

  validators = AutenticacionValidaciones;

  constructor(private fb: FormBuilder, private authService: AuthService, private cdr: ChangeDetectorRef) {
    this.resetForm = this.fb.group({
      email: [
        '',
        [Validators.required, Validators.email],
      ],
    });
  }

  get emailControl() {
    return this.resetForm.get('email');
  }

  enviarCodigo(): void {
    this.resetError = '';
    this.isLoading = true;

    if (this.resetForm.invalid) {
      this.resetForm.markAllAsTouched();
      this.isLoading = false;
      return;
    }

    const email = this.resetForm.value.email;

    this.authService.requestPasswordReset(email).subscribe({
      next: () => {
        this.correoVerificado = email;
        this.paso = 'codigo';
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Request password reset error:', err);
        this.resetError = err?.message || 'No se pudo enviar el código. Intenta nuevamente.';
        this.isLoading = false;
        this.cdr.detectChanges();
      },
    });
  }

  mostrarCambioPassword(): void {
    this.paso = 'password';
  }

  finalizarCambio(): void {
    this.paso = 'finalizado';
  }

  volverACorreo(): void {
    this.paso = 'correo';
    this.correoVerificado = '';
    this.resetError = '';
    this.resetForm.reset();
  }

  regresarALogin(): void {
    this.volverLogin.emit();
  }

  reenviarCodigoVerificacion(): void {
    if (!this.correoVerificado) {
      this.reenvioError = 'Correo no válido para reenviar código.';
      return;
    }

    this.reenvioError = '';
    this.authService.resendCode(this.correoVerificado).subscribe({
      next: () => {
        this.reenvioError = 'Código reenviado. Revisa tu correo.';
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.reenvioError = err?.message || 'No se pudo reenviar el código. Intenta más tarde.';
        this.cdr.detectChanges();
      },
    });
  }
}
