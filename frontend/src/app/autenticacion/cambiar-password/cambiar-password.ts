import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormValidators } from '../../shared/validators/form-validators';

@Component({
  selector: 'app-cambiar-password',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './cambiar-password.html',
  styleUrl: './cambiar-password.css',
})
export class CambiarPassword {
  @Output() passwordCambiado = new EventEmitter<void>();

  passwordForm: FormGroup;
  showPassword = false;
  showConfirmPassword = false;

  constructor(private fb: FormBuilder) {
    this.passwordForm = this.fb.group(
      {
        password: ['', [Validators.required]],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: FormValidators.passwordsNoCoinciden }
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
