export interface UsuarioAdmin {
  id: number;
  nombre: string;
  segundoNombre: string;
  apellido: string;
  segundoApellido: string;
  correoCorporativo: string;
  correoElectronico: string;
  telefono: string;
  rol: 'Admin' | 'Agricultor';
  cuenta: 'Activo' | 'Inactivo';
  sesion: 'En linea' | 'Sin sesion';
  fechaRegistro: string;
}

export const datosSimuladosAdmin: UsuarioAdmin[] = [
  {
    id: 1,
    nombre: 'Carlos',
    segundoNombre: 'Andres',
    apellido: 'Mendoza',
    segundoApellido: 'Ruiz',
    correoCorporativo: 'carlos.mendoza@agrovision.com',
    correoElectronico: 'carlos.mendoza@gmail.com',
    telefono: '994521188',
    rol: 'Agricultor',
    cuenta: 'Activo',
    sesion: 'En linea',
    fechaRegistro: '2026-05-18',
  },
  {
    id: 2,
    nombre: 'Mariana',
    segundoNombre: 'Isabel',
    apellido: 'Lopez',
    segundoApellido: 'Vera',
    correoCorporativo: 'mariana.lopez@agrovision.com',
    correoElectronico: 'mariana.lopez@gmail.com',
    telefono: '982146701',
    rol: 'Agricultor',
    cuenta: 'Inactivo',
    sesion: 'Sin sesion',
    fechaRegistro: '2026-04-28',
  },
  {
    id: 3,
    nombre: 'Jose',
    segundoNombre: 'Miguel',
    apellido: 'Cabrera',
    segundoApellido: 'Solis',
    correoCorporativo: 'jose.cabrera@agrovision.com',
    correoElectronico: 'jose.cabrera@gmail.com',
    telefono: '973358902',
    rol: 'Admin',
    cuenta: 'Activo',
    sesion: 'En linea',
    fechaRegistro: '2026-03-12',
  },
  {
    id: 4,
    nombre: 'Daniela',
    segundoNombre: 'Sofia',
    apellido: 'Paredes',
    segundoApellido: 'Mora',
    correoCorporativo: 'daniela.paredes@agrovision.com',
    correoElectronico: 'daniela.paredes@gmail.com',
    telefono: '968812034',
    rol: 'Agricultor',
    cuenta: 'Activo',
    sesion: 'Sin sesion',
    fechaRegistro: '2026-02-07',
  },
  {
    id: 5,
    nombre: 'Luis',
    segundoNombre: 'Fernando',
    apellido: 'Aguirre',
    segundoApellido: 'Torres',
    correoCorporativo: 'luis.aguirre@agrovision.com',
    correoElectronico: 'luis.aguirre@gmail.com',
    telefono: '951147790',
    rol: 'Admin',
    cuenta: 'Inactivo',
    sesion: 'Sin sesion',
    fechaRegistro: '2025-12-21',
  },
  {
    id: 6,
    nombre: 'Valeria',
    segundoNombre: 'Emilia',
    apellido: 'Sanchez',
    segundoApellido: 'Castro',
    correoCorporativo: 'valeria.sanchez@agrovision.com',
    correoElectronico: 'valeria.sanchez@gmail.com',
    telefono: '997804432',
    rol: 'Agricultor',
    cuenta: 'Activo',
    sesion: 'En linea',
    fechaRegistro: '2026-01-15',
  },
];
