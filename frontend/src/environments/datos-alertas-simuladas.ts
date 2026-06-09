// Tipo que define los diferentes tipos de alertas de sensores disponibles en el sistema
export type TipoAlertaSensor =
  | 'dht22'  // Sensor DHT22 de temperatura y humedad
  | 'cam'    // Cámara ESP32-CAM
  | 'capaciteV2'  // Sensor capacitivo v2 de humedad del suelo
  | 'antenaWifi'  // Antena WiFi para conectividad
  | 'sensorLdr';  // Sensor LDR (BH1750) de intensidad de luz

// Interfaz que define la estructura de datos para cada alerta de sensor
export interface AlertaSensorData {
  // Identificador único de la alerta (tipo de sensor que falló)
  id: TipoAlertaSensor;
  // Título o nombre de la alerta que se muestra al usuario
  titulo: string;
  // Descripción corta del problema que explica qué está fallando
  descripcionCorta: string;
  // Fecha y hora en que se registró la alerta
  fechaHora: string;
}

// Array que define cuáles son las alertas activas/visibles al iniciar la aplicación
// Cambie este array para simular diferentes fallos en los sensores
export const alertasActivasAlInicio: TipoAlertaSensor[] = ['dht22'];

// Catálogo con la información detallada de cada tipo de alerta posible en el sistema
// Cada alerta contiene su descripción, consejos y fecha de ocurrencia
export const catalogoAlertasSensores: Record<TipoAlertaSensor, AlertaSensorData> = {
  // Alerta para el sensor DHT22 (temperatura y humedad del aire)
  dht22: {
    // Identificador único de esta alerta
    id: 'dht22',
    // Título descriptivo del fallo del sensor
    titulo: 'Fallo en sensor DHT22',
    // Descripción que explica el problema y qué revisar
    descripcionCorta: 'No se reciben lecturas de temperatura y humedad del aire. Verifique cableado y alimentación.',
    // Fecha y hora simulada del evento
    fechaHora: '31 may 2026 · 10:18 am',
  },
  // Alerta para la cámara ESP32-CAM
  cam: {
    // Identificador único de esta alerta
    id: 'cam',
    // Título descriptivo del fallo de la cámara
    titulo: 'Fallo en cámara ESP32-CAM',
    // Descripción que explica que no se pueden capturar imágenes
    descripcionCorta: 'La cámara no responde. No es posible capturar imágenes de hoja hasta restablecer la conexión.',
    // Fecha y hora simulada del evento
    fechaHora: '31 may 2026 · 10:19 am',
  },
  // Alerta para el sensor capacitivo de humedad del suelo
  capaciteV2: {
    // Identificador único de esta alerta
    id: 'capaciteV2',
    // Título descriptivo del fallo del sensor de suelo
    titulo: 'Fallo en sensor de suelo capacitivo v1.2',
    // Descripción que explica que la lectura está interrumpida
    descripcionCorta: 'Lectura de humedad del suelo interrumpida. Revise el sensor en el sustrato.',
    // Fecha y hora simulada del evento
    fechaHora: '31 may 2026 · 10:20 am',
  },
  // Alerta para la antena WiFi
  antenaWifi: {
    // Identificador único de esta alerta
    id: 'antenaWifi',
    // Título descriptivo del fallo de WiFi
    titulo: 'Fallo en antena WiFi',
    // Descripción que explica problemas de conectividad
    descripcionCorta: 'Señal inestable o sin conexión con el invernadero. Los datos pueden no actualizarse.',
    // Fecha y hora simulada del evento
    fechaHora: '31 may 2026 · 10:21 am',
  },
  // Alerta para el sensor LDR de intensidad de luz
  sensorLdr: {
    // Identificador único de esta alerta
    id: 'sensorLdr',
    // Título descriptivo del fallo del sensor de luz
    titulo: 'Fallo en sensor LDR (BH1750)',
    // Descripción que explica que no se detecta la luz
    descripcionCorta: 'No se detecta intensidad de luz. Verifique el sensor LDR y su bus I2C.',
    // Fecha y hora simulada del evento
    fechaHora: '31 may 2026 · 10:22 am',
  },
};
