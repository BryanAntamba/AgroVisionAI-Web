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
  // Emite un evento para indicar que se debe cerrar o cancelar el modal
  @Output() cerrar = new EventEmitter<void>();
  // Emite un evento para confirmar que el usuario desea apagar el equipo
  @Output() confirmar = new EventEmitter<void>();

  // Función ejecutada al hacer clic en "Cancelar" o en la 'X'
  cerrarModal(): void {
    this.cerrar.emit();
  }

  // Función ejecutada al hacer clic en el botón rojo de "Apagar"
  confirmarApagado(): void {
    this.confirmar.emit();
  }
}
