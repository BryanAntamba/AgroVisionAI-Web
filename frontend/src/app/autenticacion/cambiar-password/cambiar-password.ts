// Importa los módulos básicos de Angular
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
// Importa herramientas para manejar formularios reactivos
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
// Importa las validaciones personalizadas del proyecto
import { AutenticacionValidaciones } from '../../shared/validators/autenticacion-validaciones';

// Decorador que define los metadatos del componente
@Component({
  selector: 'app-cambiar-password', // Etiqueta para insertar el componente
  imports: [CommonModule, ReactiveFormsModule], // Módulos requeridos en la vista
  templateUrl: './cambiar-password.html', // Archivo HTML de la vista
  styleUrls: [ // Archivos de estilos CSS
    './cambiar-password.css',
    '../../shared/validators/styles/validacion-errores.css',
    '../../shared/validators/styles/animaciones-autenticacion.css'
  ],
})
export class CambiarPassword {
  // Evento que notifica al componente padre cuando la contraseña se ha cambiado con éxito
  @Output() passwordCambiado = new EventEmitter<void>();
  // Evento para notificar al padre que el usuario desea volver a la pantalla de login
  @Output() volverLogin = new EventEmitter<void>();

  // Grupo de controles del formulario
  passwordForm: FormGroup;
  // Bandera para alternar la visibilidad de la nueva contraseña
  showPassword = false;
  // Bandera para alternar la visibilidad de la confirmación de la contraseña
  showConfirmPassword = false;
  // Expone las validaciones a la vista (HTML)
  validators = AutenticacionValidaciones;

  // Constructor donde se inyecta el FormBuilder para crear el formulario
  constructor(private fb: FormBuilder) {
    // Inicializa el formulario con sus campos y validadores
    this.passwordForm = this.fb.group(
      {
        // Campo password, es obligatorio
        password: ['', [Validators.required]],
        // Campo confirmPassword, es obligatorio
        confirmPassword: ['', [Validators.required]],
      },
      // Aplica un validador personalizado a todo el grupo para verificar que las contraseñas coincidan
      { validators: AutenticacionValidaciones.passwordsNoCoinciden }
    );
  }

  // Getter para obtener fácilmente el control 'password' desde el HTML
  get passwordControl() {
    return this.passwordForm.get('password');
  }

  // Getter para obtener fácilmente el control 'confirmPassword' desde el HTML
  get confirmPasswordControl() {
    return this.passwordForm.get('confirmPassword');
  }

  // Invierte el estado de visibilidad de la contraseña
  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  // Invierte el estado de visibilidad de la confirmación de contraseña
  toggleConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  // Método llamado al enviar el formulario para confirmar la nueva contraseña
  confirmarPassword(): void {
    // Si el formulario no cumple las validaciones
    if (this.passwordForm.invalid) {
      // Marca todos los campos como 'tocados' para que se muestren los mensajes de error en la vista
      this.passwordForm.markAllAsTouched();
      return; // Detiene la ejecución
    }

    // Si todo es válido, emite el evento de éxito
    this.passwordCambiado.emit();
  }

  // Método para regresar a la pantalla de inicio de sesión
  regresarALogin(): void {
    // Emite el evento correspondiente
    this.volverLogin.emit();
  }
}
