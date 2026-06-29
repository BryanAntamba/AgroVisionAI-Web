// Importa los módulos base de Angular necesarios para el componente
import { Component, EventEmitter, Output, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

// Decorador que define los metadatos del componente
@Component({
  selector: 'app-password-confirmacion', // Etiqueta HTML para usar este componente
  imports: [CommonModule], // Agregado CommonModule para usar ngIf y otras directivas
  templateUrl: './password-confirmacion.html', // Ruta al archivo HTML
  styleUrls: [ // Rutas a los archivos de estilos CSS
    './password-confirmacion.css',
    '../../shared/validators/styles/animaciones-autenticacion.css'
  ],
})
export class PasswordConfirmacion implements OnInit, OnDestroy {
  // Define un evento de salida para avisar al componente padre que debe regresar al login
  @Output() regresarLogin = new EventEmitter<void>();
  
  // Contador para redirección automática
  countdown = 5;
  private intervalId: any;

  ngOnInit(): void {
    // Iniciar contador de 5 segundos para redirigir automáticamente
    this.intervalId = setInterval(() => {
      this.countdown--;
      if (this.countdown <= 0) {
        clearInterval(this.intervalId);
        this.regresarAIniciarSesion();
      }
    }, 1000);
  }

  ngOnDestroy(): void {
    // Limpiar el intervalo si el componente se destruye antes
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  // Función que se ejecuta al hacer clic en el botón para volver a iniciar sesión
  regresarAIniciarSesion(): void {
    // Limpiar el intervalo antes de emitir
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    // Emite el evento para que el padre (restablecer-password) lo escuche y actúe
    this.regresarLogin.emit();
  }
}
