export type TipoAlertaSensor =
  | 'dht22'
  | 'cam'
  | 'capaciteV2'
  | 'antenaWifi'
  | 'sensorLdr';

export interface AlertaSensorData {
  id: TipoAlertaSensor;
  titulo: string;
  descripcionCorta: string;
  fechaHora: string;
}

/** IDs de alertas visibles al iniciar (cambie para simular varios fallos). */
export const alertasActivasAlInicio: TipoAlertaSensor[] = ['dht22'];

export const catalogoAlertasSensores: Record<TipoAlertaSensor, AlertaSensorData> = {
  dht22: {
    id: 'dht22',
    titulo: 'Fallo en sensor DHT22',
    descripcionCorta: 'No se reciben lecturas de temperatura y humedad del aire. Verifique cableado y alimentación.',
    fechaHora: '31 may 2026 · 10:18 am',
  },
  cam: {
    id: 'cam',
    titulo: 'Fallo en cámara ESP32-CAM',
    descripcionCorta: 'La cámara no responde. No es posible capturar imágenes de hoja hasta restablecer la conexión.',
    fechaHora: '31 may 2026 · 10:19 am',
  },
  capaciteV2: {
    id: 'capaciteV2',
    titulo: 'Fallo en sensor de suelo capacitivo v1.2',
    descripcionCorta: 'Lectura de humedad del suelo interrumpida. Revise el sensor en el sustrato.',
    fechaHora: '31 may 2026 · 10:20 am',
  },
  antenaWifi: {
    id: 'antenaWifi',
    titulo: 'Fallo en antena WiFi',
    descripcionCorta: 'Señal inestable o sin conexión con el invernadero. Los datos pueden no actualizarse.',
    fechaHora: '31 may 2026 · 10:21 am',
  },
  sensorLdr: {
    id: 'sensorLdr',
    titulo: 'Fallo en sensor LDR (BH1750)',
    descripcionCorta: 'No se detecta intensidad de luz. Verifique el sensor LDR y su bus I2C.',
    fechaHora: '31 may 2026 · 10:22 am',
  },
};
