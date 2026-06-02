export const credenciales = {
  agricultor: {
    correo: 'agricultor@agrovision.com',
    password: 'agricultor123',
    rol: 'AGRICULTOR'
  },
  admin: {
    correo: 'admin@agrovision.com',
    password: 'admin123',
    rol: 'ADMIN'
  }
};

export const rolesAcceso = {
  AGRICULTOR: ['panel-agricultor', 'historial', 'alertas', 'boton-iot'],
  ADMIN: ['panel-admin', 'usuarios', 'reportes', 'configuracion']
};
