// Interfaz que define la estructura de datos para un usuario administrador en el sistema
export interface UsuarioAdmin {
  // Identificador único del usuario
  id: number;
  // Primer nombre del usuario
  nombre: string;
  // Segundo nombre del usuario
  segundoNombre: string;
  // Primer apellido del usuario
  apellido: string;
  // Segundo apellido del usuario
  segundoApellido: string;
  // Correo corporativo asignado por la empresa
  correoCorporativo: string;
  // Correo electrónico personal del usuario
  correoElectronico: string;
  // Número de teléfono del usuario
  telefono: string;
  // Rol que desempeña el usuario en el sistema
  rol: 'Admin' | 'Agricultor';
  // Estado de la cuenta del usuario
  cuenta: 'Activo' | 'Inactivo';
  // Estado actual de la sesión del usuario
  sesion: 'En linea' | 'Sin sesion';
  // Fecha en que se registró el usuario en el sistema
  fechaRegistro: string;
}

// Array con datos simulados de usuarios para pruebas en el panel administrador
export const datosSimuladosAdmin: UsuarioAdmin[] = [
  {
    // Usuario agricultor: Carlos Andres Mendoza Ruiz
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
    // Usuario agricultor: Mariana Isabel Lopez Vera
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
    // Usuario admin: Jose Miguel Cabrera Solis
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
    // Usuario agricultor: Daniela Sofia Paredes Mora
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
    // Usuario admin: Luis Fernando Aguirre Torres
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
    // Usuario agricultor: Valeria Emilia Sanchez Castro
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
