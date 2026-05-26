import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CambiarPassword } from '../cambiar-password/cambiar-password';
import { CodigoVerificacion } from '../codigo-verificacion/codigo-verificacion';

@Component({
  selector: 'app-restablecer-password',
  imports: [CommonModule, ReactiveFormsModule, CodigoVerificacion, CambiarPassword],
  templateUrl: './restablecer-password.html',
  styleUrl: './restablecer-password.css',
})
export class RestablecerPassword {
  resetForm: FormGroup;
  resetError = '';
  correoVerificado = '';
  paso: 'correo' | 'codigo' | 'password' | 'finalizado' = 'correo';

  readonly correoSimulado = 'usuario@gmail.com';

  constructor(private fb: FormBuilder) {
    this.resetForm = this.fb.group({
      email: [
        '',
        [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@gmail\\.com$')],
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
}
