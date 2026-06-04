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

import { recomendacionesSimuladas } from './recomendaciones-registradas';

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
    accion: string;
    icono: string;
  }[] {
    // Retornar todas las recomendaciones registradas sin filtrar
    return this.obtenerTodas().map((r) => ({
      tipo: colorATipoDashboard(r.color),
      titulo: r.titulo,
      mensaje: r.descripcion,
      accion: r.accion,
      icono: colorAIcono(r.color),
    }));
  }
}
