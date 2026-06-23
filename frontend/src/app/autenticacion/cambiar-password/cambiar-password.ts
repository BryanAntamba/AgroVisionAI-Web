// Importa los módulos básicos de Angular
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, ChangeDetectorRef } from '@angular/core';
// Importa herramientas para manejar formularios reactivos
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
// Importa operadores RxJS para el control de finalización de peticiones
import { finalize } from 'rxjs/operators';
// Importa las validaciones personalizadas del proyecto
import { AutenticacionValidaciones } from '../../shared/validators/autenticacion-validaciones';
// Importa servicio de autenticación para actualizar la contraseña
import { AuthService } from '../../shared/services/auth.service';

// Decorador que define los metadatos del componente
@Component({
  selector: 'app-cambiar-password',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './cambiar-password.html',
  styleUrls: [
    './cambiar-password.css',
    '../../shared/validators/styles/validacion-errores.css',
    '../../shared/validators/styles/animaciones-autenticacion.css'
  ],
})
export class CambiarPassword {
  @Input() correo = '';
  @Output() passwordCambiado = new EventEmitter<void>();
  @Output() volverLogin = new EventEmitter<void>();

  passwordForm: FormGroup;
  showPassword = false;
  showConfirmPassword = false;
  validators = AutenticacionValidaciones;
  changeError = '';
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {
    this.passwordForm = this.fb.group(
      {
        password: ['', [Validators.required]],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: AutenticacionValidaciones.passwordsNoCoinciden }
    );
  }

  get passwordControl() {
    return this.passwordForm.get('password');
  }

  get confirmPasswordControl() {
    return this.passwordForm.get('confirmPassword');
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  confirmarPassword(): void {
    // Guarda explícita contra doble clic: si ya hay una petición en curso,
    // ignoramos el clic en vez de esperar a que [disabled] se repinte
    // (entre el clic y el repintado de Angular hay una pequeña ventana
    // donde un doble clic rápido puede colarse y disparar dos peticiones).
    if (this.isLoading) {
      return;
    }

    this.changeError = '';

    if (this.passwordForm.invalid) {
      console.warn('CambiarPassword formulario inválido:', {
        errors: this.passwordForm.errors,
        password: this.passwordForm.get('password')?.value,
        confirmPassword: this.passwordForm.get('confirmPassword')?.value,
        passwordErrors: this.passwordForm.get('password')?.errors,
        confirmPasswordErrors: this.passwordForm.get('confirmPassword')?.errors,
      });
      this.passwordForm.markAllAsTouched();
      return;
    }

    if (!this.correo) {
      this.changeError = 'Correo no disponible para actualizar la contraseña.';
      return;
    }

    const { password, confirmPassword } = this.passwordForm.value;

    console.log('CambiarPassword data:', {
      correo: this.correo,
      password,
      confirmPassword,
      formErrors: this.passwordForm.errors,
      passwordErrors: this.passwordForm.get('password')?.errors,
      confirmPasswordErrors: this.passwordForm.get('confirmPassword')?.errors,
    });

    this.isLoading = true;
    this.changeError = '';

    this.authService.changePassword(this.correo, password, confirmPassword)
      .pipe(
        finalize(() => {
          this.isLoading = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: (response) => {
          console.log('Change password response:', response);
          this.changeError = '';
          this.passwordCambiado.emit();
        },
        error: (err) => {
          console.error('Change password error:', err);
          const backendMessage = err?.message || err?.mensaje;
          this.changeError = typeof backendMessage === 'string'
            ? backendMessage
            : 'No se pudo cambiar la contraseña. Intenta nuevamente.';
        },
      });
  }

  regresarALogin(): void {
    this.volverLogin.emit();
  }
}
