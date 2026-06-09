// Objeto que contiene las credenciales de prueba para diferentes tipos de usuarios en el sistema
// Estas credenciales se utilizan para efectos de demostración en ambiente de desarrollo
export const credenciales = {
  // Credenciales para un usuario agricultor (usuario regular)
  agricultor: {
    // Correo electrónico del usuario agricultor
    correo: 'agricultor@agrovision.com',
    // Contraseña de acceso para el usuario agricultor
    password: 'agricultor123',
    // Rol asignado al usuario agricultor
    rol: 'AGRICULTOR'
  },
  // Credenciales para un usuario administrador del sistema
  admin: {
    // Correo electrónico del usuario administrador
    correo: 'admin@agrovision.com',
    // Contraseña de acceso para el usuario administrador
    password: 'admin123',
    // Rol asignado al usuario administrador
    rol: 'ADMIN'
  }
};

// Objeto que define las rutas/páginas a las que tiene acceso cada rol del sistema
export const rolesAcceso = {
  // Rutas permitidas para usuarios con rol AGRICULTOR
  AGRICULTOR: ['panel-agricultor', 'historial', 'alertas', 'boton-iot'],
  // Rutas permitidas para usuarios con rol ADMIN
  ADMIN: ['panel-admin', 'usuarios', 'reportes', 'configuracion']
};
