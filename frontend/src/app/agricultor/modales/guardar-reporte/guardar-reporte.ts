import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-guardar-reporte',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './guardar-reporte.html',
  styleUrl: './guardar-reporte.css',
})
export class GuardarReporte {
  // Emite un evento para cerrar el modal
  @Output() cerrar = new EventEmitter<void>();

  // Función ejecutada al hacer clic en "Aceptar" o fuera del modal
  cerrarModal(): void {
    this.cerrar.emit();
  }
}
