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
  // Evento de salida para notificar al componente padre (panel-agricultor) si se conectó exitosamente
  @Output() conectado = new EventEmitter<boolean>();
  
  // Estados lógicos de la interfaz del botón interactivo
  isConnecting = false; // ¿Está cargando la conexión?
  isConnected = false;  // ¿Conexión exitosa?
  errorConexion = false; // ¿Hubo un fallo en la conexión?
  descripcion = ''; // Texto explicativo mostrado debajo del botón

  // Diccionario con las frases exactas para cada escenario del componente
  private readonly MENSAJES = {
    inicial: 'Apriete el botón para conectar el dispositivo AgroVision AI',
    conectando: 'Conectando con el dispositivo, por favor espere...',
    conectado: 'Dispositivo conectado exitosamente',
    errorConexion: 'No se pudo conectar con el dispositivo AgroVision AI. Verifique que el dispositivo esté encendido y dentro del alcance de la red.',
    desconectado: 'Dispositivo desconectado',
  };

  // Constantes de simulación
  private readonly TIEMPO_CONEXION_MS = 2000; // Demora simulada de 2 segundos
  private readonly PROBABILIDAD_EXITO = 0.85; // Simula un 85% de que la conexión se efectúe

  constructor() {
    // Al construirse la clase, se define el mensaje por defecto inicial
    this.descripcion = this.getMensaje('inicial');
  }

  /**
   * Obtiene el texto descriptivo del diccionario de mensajes según la llave (estado) solicitada
   */
  private getMensaje(estado: 'inicial' | 'conectando' | 'conectado' | 'errorConexion' | 'desconectado'): string {
    return this.MENSAJES[estado];
  }

  /**
   * Simula (mediante la función random) el intento de conexión con el dispositivo
   * Retorna 'true' el 85% de las veces, imitando la vida real
   */
  private simularConexion(): boolean {
    return Math.random() < this.PROBABILIDAD_EXITO;
  }

  // Método ejecutado al presionar el gran botón de Power de la UI
  onConectarDispositivo(): void {
    // Evita doble click si ya está conectando o conectado
    if (!this.isConnecting && !this.isConnected) {
      this.isConnecting = true;
      this.errorConexion = false;
      this.descripcion = this.getMensaje('conectando');
      
      // Simula el tiempo de red (delay de 2 segundos)
      setTimeout(() => {
        const exito = this.simularConexion();
        this.isConnecting = false;
        
        // Valida si la simulación dio éxito o error
        if (exito) {
          this.isConnected = true;
          this.descripcion = this.getMensaje('conectado');
          // Emite el evento para avisar al panel que renderice el dashboard
          this.conectado.emit(true);
        } else {
          this.errorConexion = true;
          this.descripcion = this.getMensaje('errorConexion');
        }
      }, this.TIEMPO_CONEXION_MS);
    }
  }

  // Método para reiniciar el estado cuando se da clic en "Reintentar" en la UI tras un error
  reintentar(): void {
    this.errorConexion = false;
    this.descripcion = this.getMensaje('inicial');
  }

  // Resetea forzadamente todo a su estado predeterminado de cero
  resetConexion(): void {
    this.isConnecting = false;
    this.isConnected = false;
    this.errorConexion = false;
    this.descripcion = this.getMensaje('inicial');
    this.conectado.emit(false);
  }
}
