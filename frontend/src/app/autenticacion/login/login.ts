import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RestablecerPassword } from '../restablecer-password/restablecer-password';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RestablecerPassword],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  showPassword = false;
  loginError = '';
  showResetPassword = false;

  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: [
        '',
        [
          Validators.required,
          Validators.pattern('^[a-zA-Z0-9._%+-]+@agrovision\\.com$')
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
  }

  backToLogin(): void {
    this.showResetPassword = false;
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
