// Objeto que contiene todos los datos simulados de sensores IoT para una planta de tomate
// Este objeto se utiliza para pruebas y demostración sin necesidad de hardware real
export const datosIOTSimulados = {
  // Metadatos generales del sistema
  meta: {
    // Nombre de la plataforma que genera los datos
    titulo: 'AgroVision AI',
    // Fecha y hora en que se capturaron estos datos simulados
    fecha_captura: '31 may 2026 · 10:24 am',
  },
  // Información sobre la captura de imagen de la planta
  captura: {
    // Número de identificación de la planta que se está monitoreando
    numero_planta: 1,
    // Intervalo en milisegundos entre capturas sucesivas (45 segundos)
    intervalo_nueva_captura_ms: 45000,
  },
  // Datos de sensores en tiempo real del ESP32
  sensores_tiempo_real: {
    // Booleano que indica si el ESP32 está conectado y enviando datos
    esp32: true,
    // Temperatura actual del aire en grados Celsius
    temperatura_aire_c: 22.0,
    // Temperatura mínima óptima para tomates en grados Celsius
    temperatura_optima_min: 20,
    // Temperatura máxima óptima para tomates en grados Celsius
    temperatura_optima_max: 27,
    // Temperatura mínima que puede medir el sensor
    temperatura_sensor_min: 5,
    // Temperatura máxima que puede medir el sensor
    temperatura_sensor_max: 45,
    // Humedad actual del aire en porcentaje
    humedad_aire_pct: 65,
    // Humedad del aire mínima óptima para tomates en porcentaje
    humedad_aire_optima_min: 60,
    // Humedad del aire máxima óptima para tomates en porcentaje
    humedad_aire_optima_max: 80,
    // Nivel de humedad del aire donde se activa una alerta
    alerta_humedad: 85,
    // Humedad actual del suelo en porcentaje
    humedad_suelo_pct: 75,
    // Nivel mínimo de riego recomendado (por debajo se debe regar)
    riego_minimo: 40,
    // Intensidad actual de luz en lux
    intensidad_luz_lux: 52000,
    // Intensidad mínima óptima de luz en lux
    luz_optima_min: 40000,
    // Intensidad máxima óptima de luz en lux
    luz_optima_max: 70000,
    // Período del día: 'diurno' (luz) o 'nocturno' (sin luz)
    ciclo: 'diurno',
  },
  // Datos de sensores complementarios adicionales
  sensores_complementarios: {
    // Humedad estimada de la hoja en porcentaje
    humedad_hoja_pct: 15.0,
    // Humedad de hoja mínima óptima en porcentaje
    humedad_hoja_optima_min: 55,
    // Humedad de hoja máxima óptima en porcentaje
    humedad_hoja_optima_max: 85,
    // Velocidad del flujo de aire alrededor de la planta en metros por segundo
    flujo_aire_ms: 0.8,
    // Velocidad mínima de referencia de flujo de aire
    flujo_aire_ref_min: 0.3,
    // Velocidad máxima de referencia de flujo de aire
    flujo_aire_ref_max: 1.5,
  },
  // Índice general de salud de la planta
  indice_salud: {
    // Valor numérico del índice de salud (0-100)
    valor: 82,
    // Estado descriptivo breve de la salud
    estado: 'Bueno — monitoreo regular',
    // Descripción detallada de la condición de la planta
    descripcion:
      'La planta muestra signos saludables. Se detectó leve amarillamiento (2.1 %). Revise la humedad del suelo esta tarde.',
    // Array con los componentes individuales que conforman el índice de salud
    componentes: [
      // Componente de detección IA: predicción de la inteligencia artificial
      { etiqueta: 'Detección IA', valor: 92 },
      // Componente de área sana: porcentaje de área de hoja que se ve saludable
      { etiqueta: 'Área sana', valor: 79 },
      // Componente de color: evaluación del color de la hoja
      { etiqueta: 'Color', valor: 80 },
    ],
  },
  // Diagnóstico final basado en análisis de inteligencia artificial
  diagnostico_final: {
    // Predicciones individuales de cada enfermedad/condición en porcentaje
    predicciones: {
      // Probabilidad de que la planta esté sana
      healthy: 92.4,
      // Probabilidad de Tizón temprano
      early_blight: 4.2,
      // Probabilidad de Tizón tardío
      late_blight: 1.9,
      // Probabilidad de Moho foliar
      leaf_mold: 0.9,
      // Probabilidad de Mancha séptica
      septoria: 0.5,
    },
    // Confianza del modelo en su predicción final (0-100%)
    confianza_final: 92.4,
    // Diagnóstico final seleccionado por el modelo
    diagnostico_final: 'Tomato_healthy',
    // Descripción en texto del diagnóstico
    descripcion:
      'No se detectaron enfermedades activas. Las características de color, textura y morfología están dentro del rango normal.',
    // Nota sobre otras condiciones analizadas pero no detectadas
    otras_condiciones: 'Otras 9 condiciones analizadas: < 0.1 % cada una',
  },
  // Precisión general del sistema de diagnóstico
  accuracy_sistema: 94.16,
  // Métricas específicas sobre áreas afectadas de la hoja
  metricas_lesion: {
    // Porcentaje de área con lesiones activas
    area_afectada_pct: 0.0,
    // Porcentaje de área con tonalidad amarilla
    area_amarilla_pct: 2.1,
    // Porcentaje de área con tonalidad marrón
    area_marron_pct: 1.4,
    // Número de manchas/lesiones detectadas en la hoja
    manchas_detectadas: 0,
  },
  // Rutas de las imágenes capturadas
  imagenes: {
    // Ruta de la imagen original sin procesar
    original: 'assets/imagenes/tomato-original.jpg',
    // Ruta de la imagen segmentada (procesada por IA)
    segmentada: 'assets/imagenes/tomato-segmentada.jpg',
    // Booleano que indica si hay una captura real disponible
    tiene_captura: false,
  },
  // Información sobre reconexión del dispositivo
  reconexion: {
    // Número de intentos que tomó para reconectar exitosamente
    intentos_para_exito: 2,
  },
};
