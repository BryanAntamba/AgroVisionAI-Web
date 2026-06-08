import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RecomendacionRegistrada } from '../../../../environments/modales-recomendacion';

@Component({
  selector: 'app-visualizar-recomendacion',
  imports: [CommonModule],
  templateUrl: './visualizar-recomendacion.html',
  styleUrls: ['./visualizar-recomendacion.css'],
})
export class VisualizarRecomendacion {
  @Input({ required: true }) recomendacion!: RecomendacionRegistrada;
  @Output() cerrar = new EventEmitter<void>();

  cerrarModal(): void {
    this.cerrar.emit();
  }

  formatearFecha(iso: string): string {
    const d = new Date(iso);
    return d.toLocaleString('es-EC', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}
