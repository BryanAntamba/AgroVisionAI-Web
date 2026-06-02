import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-boton-iot',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './boton-iot.html',
  styleUrl: './boton-iot.css',
})
export class BotonIOT {
  @Output() conectado = new EventEmitter<boolean>();
  
  isConnecting = false;
  isConnected = false;
  descripcion = 'Apriete el botón para conectar el dispositivo AgroVision AI';

  onConectarDispositivo(): void {
    if (!this.isConnecting && !this.isConnected) {
      this.isConnecting = true;
      this.descripcion = 'Conectando con el dispositivo, por favor espere...';
      
      // Simulación de conexión - 2 segundos
      setTimeout(() => {
        this.isConnecting = false;
        this.isConnected = true;
        this.conectado.emit(true);
      }, 2000);
    }
  }

  resetConexion(): void {
    this.isConnecting = false;
    this.isConnected = false;
    this.descripcion = 'Apriete el botón para conectar el dispositivo AgroVision AI';
    this.conectado.emit(false);
  }
}
