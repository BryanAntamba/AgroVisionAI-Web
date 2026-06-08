import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RecomendacionRegistrada } from '../../../../environments/modales-recomendacion';

@Component({
  selector: 'app-eliminar-recomendacion',
  imports: [CommonModule],
  templateUrl: './eliminar-recomendacion.html',
  styleUrls: ['./eliminar-recomendacion.css'],
})
export class EliminarRecomendacion {
  @Input({ required: true }) recomendacion!: RecomendacionRegistrada;
  @Output() cerrar = new EventEmitter<void>();
  @Output() confirmar = new EventEmitter<void>();

  cerrarModal(): void {
    this.cerrar.emit();
  }

  confirmarEliminacion(): void {
    this.confirmar.emit();
  }
}
