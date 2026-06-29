import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-desconectar-dispositivo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './desconectar-dispositivo.html',
  styleUrl: './desconectar-dispositivo.css',
})
export class DesconectarDispositivo {
  // Emite un evento para indicar que se debe cerrar o cancelar el modal
  @Output() cerrar = new EventEmitter<void>();
  // Emite un evento para confirmar que el usuario desea desconectar el equipo
  @Output() confirmar = new EventEmitter<void>();

  // Función ejecutada al hacer clic en "Cancelar" o en la 'X'
  cerrarModal(): void {
    this.cerrar.emit();
  }

  // Función ejecutada al hacer clic en el botón de "Desconectar"
  confirmarDesconexion(): void {
    this.confirmar.emit();
  }
}
