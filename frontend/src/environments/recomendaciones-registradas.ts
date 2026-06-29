// Importa la interfaz RecomendacionRegistrada que define la estructura de cada recomendación
import { RecomendacionRegistrada } from './modales-recomendacion';

/**
 * Recomendaciones simuladas para el sistema AgroVision AI
 * Estas se mostrarán como recomendaciones por defecto en el panel de administración
 * Son datos de ejemplo para demostración antes de que haya datos reales
 */
// Array que contiene recomendaciones simuladas para cada aspecto del cultivo
export const recomendacionesSimuladas: RecomendacionRegistrada[] = [
  {
    // Primera recomendación: Sobre condiciones ideales
    id: 1,
    // Título de la recomendación enfocado en temperatura y luz
    titulo: 'Temperatura y luz en condiciones ideales',
    // Descripción detallada indicando los valores actuales
    descripcion: '22 °C y 52 000 lux están dentro del rango óptimo para el tomate.',
    // Acción recomendada (en este caso, no es necesaria acción)
    accion: 'No se requiere intervención de clima en este momento.',
    // Prioridad baja porque todo está bien
    prioridad: 'Baja',
    // Color verde para indicar estado positivo
    color: 'Verde',
    // Fecha de registro simulada
    fechaRegistro: '2026-05-15T10:00:00.000Z',
  },
  {
    // Segunda recomendación: Sobre ligero amarillamiento detectado
    id: 2,
    // Título que especifica el problema detectado
    titulo: 'Leve amarillamiento detectado (2.1 %)',
    // Descripción explicando que es dentro de lo normal pero hay que monitorear
    descripcion: 'Dentro del rango normal, pero monitoree. Si supera el 5 %, revise nutrición.',
    // Acción específica a realizar: revisar nitrógeno y riego
    accion: 'Revise el nivel de nitrógeno y aumente la frecuencia de riego si es necesario.',
    // Prioridad alta porque necesita seguimiento
    prioridad: 'Alta',
    // Color amarillo para indicar necesidad de atención
    color: 'Amarillo',
    // Fecha de registro simulada
    fechaRegistro: '2026-05-15T10:05:00.000Z',
  },
  {
    // Tercera recomendación: Sobre humedad foliar baja
    id: 3,
    // Título indicando el problema con la humedad de las hojas
    titulo: 'Humedad foliar por debajo del óptimo',
    // Descripción mostrando el valor actual versus el rango óptimo
    descripcion: 'La humedad estimada se encuentra por debajo del rango recomendado para el cultivo (15 %).',
    // Acción: verificar sistema de riego
    accion: 'Verifique el sistema de riego y aumente la frecuencia de monitoreo.',
    // Prioridad media porque es importante pero no crítico
    prioridad: 'Media',
    // Color naranja para indicar advertencia importante
    color: 'Naranja',
    // Fecha de registro simulada
    fechaRegistro: '2026-05-15T10:10:00.000Z',
  },
  {
    // Cuarta recomendación: Estado general de la planta
    id: 4,
    // Título positivo indicando buen estado
    titulo: 'Cultivo en buen estado',
    // Descripción general sin enfermedades detectadas
    descripcion: 'No se detectaron enfermedades activas. Mantenga el riego programado y el monitoreo semanal de hojas.',
    // Acción: continuar con plan actual
    accion: 'Continúe con el plan de monitoreo habitual.',
    // Prioridad baja para recordatorio de mantención
    prioridad: 'Baja',
    // Color verde para indicar excelente estado
    color: 'Verde',
    // Fecha de registro simulada
    fechaRegistro: '2026-05-15T10:15:00.000Z',
  },
];
