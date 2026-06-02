export const datosIOTSimulados = {
  meta: {
    titulo: 'AgroVision AI',
    fecha_captura: '31 may 2026 · 10:24 am',
  },
  captura: {
    numero_planta: 1,
    intervalo_nueva_captura_ms: 45000,
  },
  sensores_tiempo_real: {
    esp32: true,
    temperatura_aire_c: 22.0,
    temperatura_optima_min: 20,
    temperatura_optima_max: 27,
    temperatura_sensor_min: 5,
    temperatura_sensor_max: 45,
    humedad_aire_pct: 65,
    humedad_aire_optima_min: 60,
    humedad_aire_optima_max: 80,
    alerta_humedad: 85,
    humedad_suelo_pct: 75,
    riego_minimo: 40,
    intensidad_luz_lux: 52000,
    luz_optima_min: 40000,
    luz_optima_max: 70000,
    ciclo: 'diurno',
  },
  sensores_complementarios: {
    humedad_hoja_pct: 15.0,
    humedad_hoja_optima_min: 55,
    humedad_hoja_optima_max: 85,
    flujo_aire_ms: 0.8,
    flujo_aire_ref_min: 0.3,
    flujo_aire_ref_max: 1.5,
  },
  indice_salud: {
    valor: 82,
    estado: 'Bueno — monitoreo regular',
    descripcion:
      'La planta muestra signos saludables. Se detectó leve amarillamiento (2.1 %). Revise la humedad del suelo esta tarde.',
    componentes: [
      { etiqueta: 'Detección IA', valor: 92 },
      { etiqueta: 'Área sana', valor: 79 },
      { etiqueta: 'Color', valor: 80 },
    ],
  },
  diagnostico_final: {
    predicciones: {
      healthy: 92.4,
      early_blight: 4.2,
      late_blight: 1.9,
      leaf_mold: 0.9,
      septoria: 0.5,
    },
    confianza_final: 92.4,
    diagnostico_final: 'Tomato_healthy',
    descripcion:
      'No se detectaron enfermedades activas. Las características de color, textura y morfología están dentro del rango normal.',
    otras_condiciones: 'Otras 9 condiciones analizadas: < 0.1 % cada una',
  },
  accuracy_sistema: 94.16,
  metricas_lesion: {
    area_afectada_pct: 0.0,
    area_amarilla_pct: 2.1,
    area_marron_pct: 1.4,
    manchas_detectadas: 0,
  },
  imagenes: {
    original: 'assets/imagenes/tomato-original.jpg',
    segmentada: 'assets/imagenes/tomato-segmentada.jpg',
    tiene_captura: false,
  },
  reconexion: {
    intentos_para_exito: 2,
  },
};
