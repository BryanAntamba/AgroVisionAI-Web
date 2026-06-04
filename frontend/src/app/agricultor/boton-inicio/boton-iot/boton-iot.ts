import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ValidacionConexionIOT } from '../../../shared/validators/Coneccion-IOT/validacion-coneccion-IOT';

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
  errorConexion = false;
  descripcion = ValidacionConexionIOT.getMensaje('inicial');

  onConectarDispositivo(): void {
    if (!this.isConnecting && !this.isConnected) {
      this.isConnecting = true;
      this.errorConexion = false;
      this.descripcion = ValidacionConexionIOT.getMensaje('conectando');
      
      // Simulación de conexión usando validación
      setTimeout(() => {
        const exito = ValidacionConexionIOT.simularConexion();
        this.isConnecting = false;
        
        if (exito) {
          this.isConnected = true;
          this.descripcion = ValidacionConexionIOT.getMensaje('conectado');
          this.conectado.emit(true);
        } else {
          this.errorConexion = true;
          this.descripcion = ValidacionConexionIOT.getMensaje('errorConexion');
        }
      }, ValidacionConexionIOT.TIEMPO_CONEXION_MS);
    }
  }

  reintentar(): void {
    this.errorConexion = false;
    this.descripcion = ValidacionConexionIOT.getMensaje('inicial');
  }

  resetConexion(): void {
    this.isConnecting = false;
    this.isConnected = false;
    this.errorConexion = false;
    this.descripcion = ValidacionConexionIOT.getMensaje('inicial');
    this.conectado.emit(false);
  }
}
