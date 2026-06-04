/**
 * Validaciones y mensajes para la conexión del dispositivo IoT
 */
export class ValidacionConexionIOT {
  /**
   * Mensajes de estado de la conexión
   */
  static readonly MENSAJES = {
    inicial: 'Apriete el botón para conectar el dispositivo AgroVision AI',
    conectando: 'Conectando con el dispositivo, por favor espere...',
    conectado: 'Dispositivo conectado exitosamente',
    errorConexion: 'No se pudo conectar con el dispositivo AgroVision AI. Verifique que el dispositivo esté encendido y dentro del alcance de la red.',
    desconectado: 'Dispositivo desconectado',
  };

  /**
   * Configuración de la simulación de conexión
   */
  static readonly TIEMPO_CONEXION_MS = 2000;
  static readonly PROBABILIDAD_EXITO = 0.85; // 85% de probabilidad de éxito

  /**
   * Simula el intento de conexión con el dispositivo IoT
   * Retorna true si la conexión fue exitosa, false si falló
   */
  static simularConexion(): boolean {
    return Math.random() < this.PROBABILIDAD_EXITO;
  }

  /**
   * Obtiene el mensaje apropiado según el estado de conexión
   */
  static getMensaje(estado: 'inicial' | 'conectando' | 'conectado' | 'errorConexion' | 'desconectado'): string {
    return this.MENSAJES[estado];
  }
}
