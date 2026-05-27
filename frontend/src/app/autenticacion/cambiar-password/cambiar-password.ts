import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AutenticacionValidaciones } from '../../shared/validators/autenticacion-validaciones';

@Component({
  selector: 'app-cambiar-password',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './cambiar-password.html',
  styleUrls: [
    './cambiar-password.css',
    '../../shared/styles/validacion-errores.css',
    '../../shared/styles/animaciones-autenticacion.css'
  ],
})
export class CambiarPassword {
  @Output() passwordCambiado = new EventEmitter<void>();

  passwordForm: FormGroup;
  showPassword = false;
  showConfirmPassword = false;
  validators = AutenticacionValidaciones;

  constructor(private fb: FormBuilder) {
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
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }

    this.passwordCambiado.emit();
  }
}
