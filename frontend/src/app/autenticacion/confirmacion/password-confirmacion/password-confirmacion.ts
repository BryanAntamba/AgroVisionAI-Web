// Importa los módulos base de Angular necesarios para el componente
import { Component, EventEmitter, Output } from '@angular/core';

// Decorador que define los metadatos del componente
@Component({
  selector: 'app-password-confirmacion', // Etiqueta HTML para usar este componente
  imports: [], // No tiene dependencias externas
  templateUrl: './password-confirmacion.html', // Ruta al archivo HTML
  styleUrls: [ // Rutas a los archivos de estilos CSS
    './password-confirmacion.css',
    '../../../shared/validators/styles/animaciones-autenticacion.css'
  ],
})
export class PasswordConfirmacion {
  // Define un evento de salida para avisar al componente padre que debe regresar al login
  @Output() regresarLogin = new EventEmitter<void>();

  // Función que se ejecuta al hacer clic en el botón para volver a iniciar sesión
  regresarAIniciarSesion(): void {
    // Emite el evento para que el padre (restablecer-password) lo escuche y actúe
    this.regresarLogin.emit();
  }
}
