import { RecomendacionRegistrada } from './modales-recomendacion';

/**
 * Recomendaciones simuladas para el sistema AgroVision AI
 * Estas se mostrarán como recomendaciones por defecto en el panel de administración
 */
export const recomendacionesSimuladas: RecomendacionRegistrada[] = [
  {
    id: 1,
    titulo: 'Temperatura y luz en condiciones ideales',
    descripcion: '22 °C y 52 000 lux están dentro del rango óptimo para el tomate.',
    accion: 'No se requiere intervención de clima en este momento.',
    prioridad: 'Baja',
    color: 'Verde',
    fechaRegistro: '2026-05-15T10:00:00.000Z',
  },
  {
    id: 2,
    titulo: 'Leve amarillamiento detectado (2.1 %)',
    descripcion: 'Dentro del rango normal, pero monitoree. Si supera el 5 %, revise nutrición.',
    accion: 'Revise el nivel de nitrógeno y aumente la frecuencia de riego si es necesario.',
    prioridad: 'Alta',
    color: 'Amarillo',
    fechaRegistro: '2026-05-15T10:05:00.000Z',
  },
  {
    id: 3,
    titulo: 'Humedad foliar por debajo del óptimo',
    descripcion: 'La humedad estimada se encuentra por debajo del rango recomendado para el cultivo (15 %).',
    accion: 'Verifique el sistema de riego y aumente la frecuencia de monitoreo.',
    prioridad: 'Media',
    color: 'Naranja',
    fechaRegistro: '2026-05-15T10:10:00.000Z',
  },
  {
    id: 4,
    titulo: 'Cultivo en buen estado',
    descripcion: 'No se detectaron enfermedades activas. Mantenga el riego programado y el monitoreo semanal de hojas.',
    accion: 'Continúe con el plan de monitoreo habitual.',
    prioridad: 'Baja',
    color: 'Verde',
    fechaRegistro: '2026-05-15T10:15:00.000Z',
  },
];
