// Importa las recomendaciones simuladas que se usan por defecto
import { recomendacionesSimuladas } from './recomendaciones-registradas';

// Tipo que define los niveles de prioridad posibles para una recomendación
export type PrioridadRecomendacion = 'Baja' | 'Media' | 'Alta' | 'Critica';

// Tipo que define los colores que se usan para categorizar recomendaciones visualmente
export type ColorRecomendacion = 'Verde' | 'Amarillo' | 'Naranja' | 'Rojo';

// Interfaz que define la estructura de una recomendación registrada en el sistema
export interface RecomendacionRegistrada {
  // Identificador único de la recomendación (UUID del backend o número local)
  id: string | number;
  // Título corto de la recomendación
  titulo: string;
  // Descripción detallada de la recomendación
  descripcion: string;
  // Acción específica que se recomienda realizar
  accion: string;
  // Nivel de prioridad de la recomendación
  prioridad: PrioridadRecomendacion;
  // Color asignado a la recomendación para codificación visual
  color: ColorRecomendacion;
  // Fecha y hora en que se registró la recomendación
  fechaRegistro: string;
}

// Array que contiene todas las opciones posibles de prioridades disponibles
// Se usa para poblar selectores en formularios
export const PRIORIDADES_OPCIONES: PrioridadRecomendacion[] = ['Baja', 'Media', 'Alta', 'Critica'];

// Array que contiene todos los colores disponibles para categorizar recomendaciones
// Se usa para poblar selectores de color en la interfaz
export const COLORES_OPCIONES: ColorRecomendacion[] = ['Verde', 'Amarillo', 'Naranja', 'Rojo'];

// Clave para almacenar y recuperar recomendaciones del localStorage del navegador
const STORAGE_KEY = 'agrovision_recomendaciones';

// Función que convierte un color de recomendación a un tipo de estado para dashboard
// Mapea colores a estados visuales para mostrar en el panel de control
export function colorATipoDashboard(color: ColorRecomendacion): 'ok' | 'warn' | 'crit' {
  // Verde representa un estado correcto/normal
  if (color === 'Verde') return 'ok';
  // Rojo representa un estado crítico/error
  if (color === 'Rojo') return 'crit';
  // Amarillo y Naranja representan un estado de advertencia
  return 'warn';
}

// Función que mapea un color de recomendación a un icono de Font Awesome
// Retorna el nombre del icono para mostrar junto a la recomendación
export function colorAIcono(color: ColorRecomendacion): string {
  // Mapeo de colores a iconos Font Awesome
  const map: Record<ColorRecomendacion, string> = {
    // Icono de círculo con check para estado normal
    Verde: 'fa-circle-check',
    // Icono de triángulo de exclamación para advertencias
    Amarillo: 'fa-triangle-exclamation',
    // Icono de triángulo de exclamación para advertencias
    Naranja: 'fa-triangle-exclamation',
    // Icono de círculo de exclamación para estado crítico
    Rojo: 'fa-circle-exclamation',
  };
  return map[color];
}

// Clase que gestiona el almacenamiento y manipulación de recomendaciones en el sistema
// Proporciona métodos estáticos para acceder y modificar la lista de recomendaciones
export class RecomendacionesStore {
  // Propiedad privada estática que mantiene la lista de recomendaciones en memoria
  // Se inicializa cargando del localStorage o usando datos simulados
  private static lista: RecomendacionRegistrada[] = RecomendacionesStore.cargar();

  // Método privado estático que carga recomendaciones del localStorage
  // Si hay datos guardados, los retorna; si no, retorna los datos simulados
  private static cargar(): RecomendacionRegistrada[] {
    try {
      // Obtiene el string JSON del localStorage usando la clave definida
      const raw = localStorage.getItem(STORAGE_KEY);
      // Si hay datos guardados, los convierte a objeto y los retorna
      if (raw) {
        return JSON.parse(raw) as RecomendacionRegistrada[];
      }
    } catch {
      /* Si hay error, continúa con datos simulados */
    }
    // Si no hay datos o hay error, copia y retorna los datos simulados
    return [...recomendacionesSimuladas];
  }

  // Método privado estático que guarda la lista actual de recomendaciones en localStorage
  // Se ejecuta después de cada modificación para persistir los cambios
  private static persistir(): void {
    // Convierte la lista a JSON y la guarda en localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.lista));
  }

  // Método público estático que retorna todas las recomendaciones ordenadas por fecha
  // Ordena de más reciente a más antigua
  static obtenerTodas(): RecomendacionRegistrada[] {
    // Crea una copia del array y la ordena descendentemente por fecha
    return [...this.lista].sort(
      (a, b) => new Date(b.fechaRegistro).getTime() - new Date(a.fechaRegistro).getTime()
    );
  }

  // Método público estático que busca una recomendación por su ID
  // Retorna la recomendación si la encuentra, undefined si no existe
  static obtenerPorId(id: string | number): RecomendacionRegistrada | undefined {
    return this.lista.find((r) => r.id === id);
  }

  // Método público estático que agrega una nueva recomendación al sistema
  // Retorna la recomendación creada con ID y fecha asignados automáticamente
  static agregar(data: Omit<RecomendacionRegistrada, 'id' | 'fechaRegistro'>): RecomendacionRegistrada {
    // Calcula el siguiente ID disponible (convierte a número si es necesario)
    const ids = this.lista.map((r) => typeof r.id === 'number' ? r.id : 0);
    const nuevo: RecomendacionRegistrada = {
      // Copia todos los datos proporcionados
      ...data,
      // Genera un nuevo ID una unidad mayor que el máximo actual
      id: Math.max(0, ...ids) + 1,
      // Asigna la fecha y hora actual en formato ISO
      fechaRegistro: new Date().toISOString(),
    };
    // Agrega la nueva recomendación al inicio del array
    this.lista = [nuevo, ...this.lista];
    // Persiste los cambios en localStorage
    this.persistir();
    // Retorna la recomendación creada
    return nuevo;
  }

  // Método público estático que actualiza los datos de una recomendación existente
  // Busca por ID y reemplaza solo los campos proporcionados
  static actualizar(id: string | number, data: Omit<RecomendacionRegistrada, 'id' | 'fechaRegistro'>): void {
    // Busca el índice de la recomendación con el ID dado
    const idx = this.lista.findIndex((r) => r.id === id);
    // Si no encuentra la recomendación, retorna sin hacer nada
    if (idx === -1) return;
    // Reemplaza la recomendación con los datos actualizados manteniendo ID y fecha
    this.lista[idx] = { ...this.lista[idx], ...data };
    // Persiste los cambios en localStorage
    this.persistir();
  }

  // Método público estático que elimina una recomendación por su ID
  // Filtra el array para remover la recomendación solicitada
  static eliminar(id: string | number): void {
    // Filtra el array manteniendo solo las recomendaciones con ID diferente
    this.lista = this.lista.filter((r) => r.id !== id);
    // Persiste los cambios en localStorage
    this.persistir();
  }

  // Método público estático que retorna las recomendaciones formateadas para mostrar en dashboard
  // Convierte las recomendaciones en un formato compatible con la vista del panel
  static paraDashboard(): {
    // Tipo de estado visual: correcto, advertencia o crítico
    tipo: 'ok' | 'warn' | 'crit';
    // Título de la recomendación
    titulo: string;
    // Mensaje/descripción de la recomendación
    mensaje: string;
    // Acción recomendada a realizar
    accion: string;
    // Icono Font Awesome a mostrar
    icono: string;
  }[] {
    // Retorna todas las recomendaciones registradas sin filtrar
    // Las mapea al formato esperado por el dashboard
    return this.obtenerTodas().map((r) => ({
      // Convierte el color a tipo de estado
      tipo: colorATipoDashboard(r.color),
      // Usa el título de la recomendación
      titulo: r.titulo,
      // Usa la descripción como mensaje
      mensaje: r.descripcion,
      // Usa la acción recomendada
      accion: r.accion,
      // Convierte el color a icono Font Awesome
      icono: colorAIcono(r.color),
    }));
  }
}
