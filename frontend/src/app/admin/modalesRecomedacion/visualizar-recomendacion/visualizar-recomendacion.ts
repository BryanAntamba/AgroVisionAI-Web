// Importa el módulo común de Angular con directivas básicas
import { CommonModule } from '@angular/common';
// Importa decoradores para componentes, entradas y salidas
import { Component, EventEmitter, Input, Output } from '@angular/core';
// Importa la interfaz de recomendación registrada
import { RecomendacionRegistrada } from '../../../../environments/modales-recomendacion';

// Decorador que define este componente de Angular
@Component({
  selector: 'app-visualizar-recomendacion', // Selector HTML para usar este componente
  imports: [CommonModule], // Solo necesita módulo común para directivas básicas
  templateUrl: './visualizar-recomendacion.html', // Ruta al archivo de template HTML
  styleUrls: ['./visualizar-recomendacion.css'], // Ruta a la hoja de estilos
})
// Clase del componente para visualizar detalles de una recomendación en modo solo lectura
export class VisualizarRecomendacion {
  // Propiedad de entrada requerida que recibe la recomendación a visualizar desde el componente padre
  @Input({ required: true }) recomendacion!: RecomendacionRegistrada;
  // Evento de salida para notificar al padre cuando se debe cerrar el modal
  @Output() cerrar = new EventEmitter<void>();

  // Método que emite el evento de cierre del modal
  cerrarModal(): void {
    this.cerrar.emit();
  }

  // Método que formatea una fecha ISO a un formato legible en español ecuatoriano
  formatearFecha(iso: string): string {
    // Convierte la cadena ISO a objeto Date
    const d = new Date(iso);
    // Retorna la fecha formateada usando la configuración regional de Ecuador
    return d.toLocaleString('es-EC', {
      day: '2-digit', // Día con 2 dígitos (01, 02, etc.)
      month: 'short', // Mes abreviado (ene, feb, etc.)
      year: 'numeric', // Año completo (2024)
      hour: '2-digit', // Hora con 2 dígitos
      minute: '2-digit', // Minutos con 2 dígitos
    });
  }
}
