import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalesValidaciones } from '../../shared/validators/modales-validaciones';
import { AutenticacionValidaciones } from '../../shared/validators/autenticacion-validaciones';
import { RestablecerPassword } from '../restablecer-password/restablecer-password';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RestablecerPassword],
  templateUrl: './login.html',
  styleUrls: [
    './login.css',
    '../../shared/styles/validacion-errores.css',
    '../../shared/styles/animaciones-autenticacion.css'
  ]
})
export class Login {
  showPassword = false;
  loginError = '';
  showResetPassword = false;

  loginForm: FormGroup;
  validators = AutenticacionValidaciones;

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: [
        '',
        [
          Validators.required,
          Validators.pattern(ModalesValidaciones.CORREO_CORPORATIVO_PATTERN)
        ]
      ],
      password: ['', [Validators.required]]
    });

  }

  get emailControl() {
    return this.loginForm.get('email');
  }

  get passwordControl() {
    return this.loginForm.get('password');
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  openResetPassword(): void {
    this.showResetPassword = true;
    this.loginError = '';
    this.loginForm.markAsUntouched();
  }

  backToLogin(): void {
    this.showResetPassword = false;
    this.loginError = '';
    this.showPassword = false;
    this.loginForm.reset();
  }

  onSubmit(): void {
    this.loginError = '';

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { email, password } = this.loginForm.value;

    if (email === 'admin@agrovision.com' && password === 'admin123') {
      this.router.navigate(['/panel-admin']);
      return;
    }

    if (email === 'agricultor@agrovision.com' && password === 'agricultor123') {
      this.router.navigate(['/panel-agricultor']);
      return;
    }

    this.loginError = 'Credenciales incorrectas. Verifique el correo y la contraseña.';
  }

}
