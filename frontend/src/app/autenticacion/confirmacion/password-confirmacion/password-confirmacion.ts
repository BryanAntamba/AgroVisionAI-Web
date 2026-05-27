import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-password-confirmacion',
  imports: [],
  templateUrl: './password-confirmacion.html',
  styleUrls: [
    './password-confirmacion.css',
    '../../../shared/styles/animaciones-autenticacion.css'
  ],
})
export class PasswordConfirmacion {
  @Output() regresarLogin = new EventEmitter<void>();

  regresarAIniciarSesion(): void {
    this.regresarLogin.emit();
  }
}
