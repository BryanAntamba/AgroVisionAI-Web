import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-apagar-equipo-iot',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './apagar-equipo-iot.html',
  styleUrl: './apagar-equipo-iot.css',
})
export class ApagarEquipoIOT {
  @Output() cerrar = new EventEmitter<void>();
  @Output() confirmar = new EventEmitter<void>();

  cerrarModal(): void {
    this.cerrar.emit();
  }

  confirmarApagado(): void {
    this.confirmar.emit();
  }
}
