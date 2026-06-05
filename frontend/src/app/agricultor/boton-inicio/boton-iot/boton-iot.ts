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
  
  // Estado del componente
  isConnecting = false;
  isConnected = false;
  errorConexion = false;
  descripcion = '';

  // Configuración de validación y mensajes
  private readonly MENSAJES = {
    inicial: 'Apriete el botón para conectar el dispositivo AgroVision AI',
    conectando: 'Conectando con el dispositivo, por favor espere...',
    conectado: 'Dispositivo conectado exitosamente',
    errorConexion: 'No se pudo conectar con el dispositivo AgroVision AI. Verifique que el dispositivo esté encendido y dentro del alcance de la red.',
    desconectado: 'Dispositivo desconectado',
  };

  private readonly TIEMPO_CONEXION_MS = 2000;
  private readonly PROBABILIDAD_EXITO = 0.85; // 85% de probabilidad de éxito

  constructor() {
    // Inicializar descripción después de que el componente esté construido
    this.descripcion = this.getMensaje('inicial');
  }

  /**
   * Obtiene el mensaje apropiado según el estado de conexión
   */
  private getMensaje(estado: 'inicial' | 'conectando' | 'conectado' | 'errorConexion' | 'desconectado'): string {
    return this.MENSAJES[estado];
  }

  /**
   * Simula el intento de conexión con el dispositivo IoT
   * Retorna true si la conexión fue exitosa, false si falló
   */
  private simularConexion(): boolean {
    return Math.random() < this.PROBABILIDAD_EXITO;
  }

  onConectarDispositivo(): void {
    if (!this.isConnecting && !this.isConnected) {
      this.isConnecting = true;
      this.errorConexion = false;
      this.descripcion = this.getMensaje('conectando');
      
      // Simulación de conexión
      setTimeout(() => {
        const exito = this.simularConexion();
        this.isConnecting = false;
        
        if (exito) {
          this.isConnected = true;
          this.descripcion = this.getMensaje('conectado');
          this.conectado.emit(true);
        } else {
          this.errorConexion = true;
          this.descripcion = this.getMensaje('errorConexion');
        }
      }, this.TIEMPO_CONEXION_MS);
    }
  }

  reintentar(): void {
    this.errorConexion = false;
    this.descripcion = this.getMensaje('inicial');
  }

  resetConexion(): void {
    this.isConnecting = false;
    this.isConnected = false;
    this.errorConexion = false;
    this.descripcion = this.getMensaje('inicial');
    this.conectado.emit(false);
  }
}
