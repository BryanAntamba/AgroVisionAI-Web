export type PrioridadRecomendacion = 'Baja' | 'Media' | 'Alta' | 'Critica';
export type ColorRecomendacion = 'Verde' | 'Amarillo' | 'Naranja' | 'Rojo';

export interface RecomendacionRegistrada {
  id: number;
  titulo: string;
  descripcion: string;
  accion: string;
  prioridad: PrioridadRecomendacion;
  color: ColorRecomendacion;
  fechaRegistro: string;
}

export const PRIORIDADES_OPCIONES: PrioridadRecomendacion[] = ['Baja', 'Media', 'Alta', 'Critica'];

export const COLORES_OPCIONES: ColorRecomendacion[] = ['Verde', 'Amarillo', 'Naranja', 'Rojo'];

export const recomendacionesSimuladas: RecomendacionRegistrada[] = [
  {
    id: 1,
    titulo: 'Cultivo en buen estado',
    descripcion: 'No se detectaron enfermedades activas. Mantenga el riego programado y el monitoreo semanal de hojas.',
    accion: 'Continúe con el plan de monitoreo habitual.',
    prioridad: 'Baja',
    color: 'Verde',
    fechaRegistro: '2026-05-31T08:00:00',
  },
  {
    id: 2,
    titulo: 'Humedad foliar por debajo del óptimo',
    descripcion: 'La humedad estimada se encuentra por debajo del rango recomendado para el cultivo (15 %).',
    accion: 'Verifique el sistema de riego y aumente la frecuencia de monitoreo.',
    prioridad: 'Media',
    color: 'Amarillo',
    fechaRegistro: '2026-05-31T09:15:00',
  },
  {
    id: 3,
    titulo: 'Leve amarillamiento detectado (2.1 %)',
    descripcion: 'Dentro del rango normal, pero monitoree. Si supera el 5 %, revise nutrición.',
    accion: 'Revise el nivel de nitrógeno y aumente la frecuencia de riego si es necesario.',
    prioridad: 'Alta',
    color: 'Naranja',
    fechaRegistro: '2026-05-31T10:30:00',
  },
  {
    id: 4,
    titulo: 'Temperatura y luz en condiciones ideales',
    descripcion: '22 °C y 52 000 lux están dentro del rango óptimo para el tomate.',
    accion: 'No se requiere intervención de clima en este momento.',
    prioridad: 'Baja',
    color: 'Verde',
    fechaRegistro: '2026-05-31T11:00:00',
  },
];

const STORAGE_KEY = 'agrovision_recomendaciones';

export function colorATipoDashboard(color: ColorRecomendacion): 'ok' | 'warn' | 'crit' {
  if (color === 'Verde') return 'ok';
  if (color === 'Rojo') return 'crit';
  return 'warn';
}

export function colorAIcono(color: ColorRecomendacion): string {
  const map: Record<ColorRecomendacion, string> = {
    Verde: 'fa-circle-check',
    Amarillo: 'fa-triangle-exclamation',
    Naranja: 'fa-triangle-exclamation',
    Rojo: 'fa-circle-exclamation',
  };
  return map[color];
}

export class RecomendacionesStore {
  private static lista: RecomendacionRegistrada[] = RecomendacionesStore.cargar();

  private static cargar(): RecomendacionRegistrada[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        return JSON.parse(raw) as RecomendacionRegistrada[];
      }
    } catch {
      /* usar simulados */
    }
    return [...recomendacionesSimuladas];
  }

  private static persistir(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.lista));
  }

  static obtenerTodas(): RecomendacionRegistrada[] {
    return [...this.lista].sort(
      (a, b) => new Date(b.fechaRegistro).getTime() - new Date(a.fechaRegistro).getTime()
    );
  }

  static obtenerPorId(id: number): RecomendacionRegistrada | undefined {
    return this.lista.find((r) => r.id === id);
  }

  static agregar(data: Omit<RecomendacionRegistrada, 'id' | 'fechaRegistro'>): RecomendacionRegistrada {
    const nuevo: RecomendacionRegistrada = {
      ...data,
      id: Math.max(0, ...this.lista.map((r) => r.id)) + 1,
      fechaRegistro: new Date().toISOString(),
    };
    this.lista = [nuevo, ...this.lista];
    this.persistir();
    return nuevo;
  }

  static actualizar(id: number, data: Omit<RecomendacionRegistrada, 'id' | 'fechaRegistro'>): void {
    const idx = this.lista.findIndex((r) => r.id === id);
    if (idx === -1) return;
    this.lista[idx] = { ...this.lista[idx], ...data };
    this.persistir();
  }

  static eliminar(id: number): void {
    this.lista = this.lista.filter((r) => r.id !== id);
    this.persistir();
  }

  static paraDashboard(): {
    tipo: 'ok' | 'warn' | 'crit';
    titulo: string;
    mensaje: string;
    icono: string;
  }[] {
    return this.obtenerTodas().map((r) => ({
      tipo: colorATipoDashboard(r.color),
      titulo: r.titulo,
      mensaje: r.descripcion,
      icono: colorAIcono(r.color),
    }));
  }
}
