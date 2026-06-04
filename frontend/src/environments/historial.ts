export interface RegistroHistorial {
  id: number;
  fecha: string;
  hora: string;
  planta: string;
  diagnostico: string;
  confianza: number;
  salud: number;
  temperatura: number;
  humedadAire: number;
  humedadSuelo: number;
  luz: number;
}

export const historialSimulado: RegistroHistorial[] = [
  {
    id: 1,
    fecha: '2026-05-31',
    hora: '10:24',
    planta: 'Planta #04',
    diagnostico: 'Tomate sano',
    confianza: 92.4,
    salud: 82,
    temperatura: 22.0,
    humedadAire: 65,
    humedadSuelo: 75,
    luz: 52000,
  },
  {
    id: 2,
    fecha: '2026-05-30',
    hora: '15:45',
    planta: 'Planta #03',
    diagnostico: 'Tizón temprano',
    confianza: 85.2,
    salud: 65,
    temperatura: 25.4,
    humedadAire: 60,
    humedadSuelo: 68,
    luz: 48000,
  },
  {
    id: 3,
    fecha: '2026-05-29',
    hora: '09:15',
    planta: 'Planta #02',
    diagnostico: 'Tomate sano',
    confianza: 91.8,
    salud: 88,
    temperatura: 19.2,
    humedadAire: 82,
    humedadSuelo: 42,
    luz: 35000,
  },
  {
    id: 4,
    fecha: '2026-05-28',
    hora: '14:30',
    planta: 'Planta #07',
    diagnostico: 'Tizón tardío',
    confianza: 88.5,
    salud: 45,
    temperatura: 23.8,
    humedadAire: 78,
    humedadSuelo: 55,
    luz: 41000,
  },
  {
    id: 5,
    fecha: '2026-05-27',
    hora: '11:00',
    planta: 'Planta #01',
    diagnostico: 'Moho foliar',
    confianza: 79.3,
    salud: 52,
    temperatura: 21.5,
    humedadAire: 85,
    humedadSuelo: 62,
    luz: 38000,
  },
  {
    id: 6,
    fecha: '2026-05-26',
    hora: '08:45',
    planta: 'Planta #05',
    diagnostico: 'Tomate sano',
    confianza: 93.7,
    salud: 90,
    temperatura: 20.3,
    humedadAire: 70,
    humedadSuelo: 58,
    luz: 45000,
  },
  {
    id: 7,
    fecha: '2026-05-25',
    hora: '16:20',
    planta: 'Planta #06',
    diagnostico: 'Mancha séptica',
    confianza: 76.8,
    salud: 48,
    temperatura: 24.2,
    humedadAire: 68,
    humedadSuelo: 50,
    luz: 47000,
  },
  {
    id: 8,
    fecha: '2026-05-24',
    hora: '13:10',
    planta: 'Planta #08',
    diagnostico: 'Tomate sano',
    confianza: 94.2,
    salud: 85,
    temperatura: 22.7,
    humedadAire: 65,
    humedadSuelo: 70,
    luz: 53000,
  },
];
