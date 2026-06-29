// Importa el módulo común de Angular con directivas básicas
import { CommonModule } from '@angular/common';
// Importa decoradores para componentes, entradas y salidas
import { Component, EventEmitter, Input, Output } from '@angular/core';
// Importa la interfaz de recomendación registrada
import { RecomendacionRegistrada } from '../../../../environments/modales-recomendacion';

// Decorador que define este componente de Angular
@Component({
  selector: 'app-eliminar-recomendacion', // Selector HTML para usar este componente
  imports: [CommonModule], // Solo necesita módulo común para directivas básicas
  templateUrl: './eliminar-recomendacion.html', // Ruta al archivo de template HTML
  styleUrls: ['./eliminar-recomendacion.css'], // Ruta a la hoja de estilos
})
// Clase del componente modal de confirmación para eliminar una recomendación
export class EliminarRecomendacion {
  // Propiedad de entrada requerida que recibe la recomendación a eliminar desde el componente padre
  @Input({ required: true }) recomendacion!: RecomendacionRegistrada;
  // Evento de salida para notificar al padre cuando se debe cerrar el modal sin eliminar
  @Output() cerrar = new EventEmitter<void>();
  // Evento de salida para notificar al padre cuando el usuario confirma la eliminación
  @Output() confirmar = new EventEmitter<void>();

  // Método que emite el evento de cierre del modal sin realizar la eliminación
  cerrarModal(): void {
    this.cerrar.emit();
  }

  // Método que emite el evento de confirmación de eliminación
  confirmarEliminacion(): void {
    this.confirmar.emit();
  }
}
