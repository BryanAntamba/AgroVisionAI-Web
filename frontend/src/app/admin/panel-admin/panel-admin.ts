// Importa módulo común de Angular que proporciona directivas básicas como *ngIf, *ngFor
import { CommonModule } from '@angular/common';
// Importa el decorador Component para definir un componente Angular
import { Component } from '@angular/core';
// Importa el módulo de formularios para usar [(ngModel)] en el template
import { FormsModule } from '@angular/forms';
// Importa el componente de barra de navegación específico para administradores
import { BarraAdmin } from '../../navbars/barra-admin/barra-admin';
// Importa la interfaz DatosUsuario que define la estructura de datos del formulario de registro
import { DatosUsuario } from '../modales/registro-usuario/registro-usuario';
// Importa el componente modal para registrar nuevos usuarios
import { RegistroUsuario } from '../modales/registro-usuario/registro-usuario';
// Importa el componente modal para editar usuarios existentes y su interfaz de datos
import { EditarUsuario, UsuarioEditar } from '../modales/editar-usuario/editar-usuario';
// Importa el componente modal para ver el perfil completo de un usuario
import { PerfilUsuario } from '../modales/perfil-usuario/perfil-usuario';
// Importa el componente modal para confirmar la eliminación de un usuario
import { EliminarUsuario } from '../modales/eliminar-usuario/eliminar-usuario';
// Importa los datos de prueba y la interfaz UsuarioAdmin desde el archivo de simulación
import { datosSimuladosAdmin, UsuarioAdmin as UsuarioAdminInterface } from '../../../environments/datos-simulados-admin';

// Define un tipo literal para los roles posibles de un usuario
type RolUsuario = 'Admin' | 'Agricultor';
// Define un tipo literal para los estados de cuenta posibles
type EstadoCuenta = 'Activo' | 'Inactivo';
// Define un tipo literal para los estados de sesión posibles
type EstadoSesion = 'En linea' | 'Sin sesion';
// Define un tipo literal para los estados de vinculación de dispositivo IoT
type EstadoDispositivo = 'Dispositivo vinculado' | 'Dispositivo no vinculado';
// Define un tipo literal para los modos del modal reutilizable (registro, edición o visualización de perfil)
type ModalModo = 'registro' | 'editar' | 'perfil';

// Interfaz que define la estructura completa de un usuario en el panel de administración
interface UsuarioAdmin {
  // Identificador único del usuario
  id: number;
  // Primer nombre del usuario
  nombre: string;
  // Segundo nombre del usuario (opcional en algunos casos)
  segundoNombre: string;
  // Apellido paterno del usuario
  apellido: string;
  // Apellido materno del usuario (opcional en algunos casos)
  segundoApellido: string;
  // Correo corporativo asignado por la organización
  correoCorporativo: string;
  // Correo electrónico personal del usuario
  correoElectronico: string;
  // Número de teléfono de contacto
  telefono: string;
  // Rol del usuario en el sistema (Admin o Agricultor)
  rol: RolUsuario;
  // Estado de la cuenta del usuario (Activo o Inactivo)
  cuenta: EstadoCuenta;
  // Estado de sesión actual del usuario (En linea o Sin sesion)
  sesion: EstadoSesion;
  // Estado de vinculación de dispositivo IoT (opcional, solo para agricultores)
  dispositivo?: EstadoDispositivo;
  // Fecha de registro del usuario en formato ISO (YYYY-MM-DD)
  fechaRegistro: string;
}

// Decorador @Component que define los metadatos del componente Angular
@Component({
  // Selector CSS para usar este componente en templates como <app-panel-admin>
  selector: 'app-panel-admin',
  // Array de módulos y componentes que este componente puede usar en su template
  imports: [
    // Módulo común para usar directivas básicas de Angular
    CommonModule,
    // Módulo de formularios para usar [(ngModel)]
    FormsModule,
    // Componente de barra de navegación del admin
    BarraAdmin,
    // Componente modal para registrar usuarios
    RegistroUsuario,
    // Componente modal para editar usuarios
    EditarUsuario,
    // Componente modal para ver perfil de usuarios
    PerfilUsuario,
    // Componente modal para eliminar usuarios
    EliminarUsuario,
  ],
  // Ruta relativa al archivo HTML que contiene el template del componente
  templateUrl: './panel-admin.html',
  // Ruta relativa al archivo CSS que contiene los estilos del componente
  styleUrl: './panel-admin.css',
})
// Clase que contiene toda la lógica del componente Panel de Administración
export class PanelAdmin {
  // Propiedad para almacenar el término de búsqueda ingresado por el usuario
  busqueda = '';
  // Propiedad para almacenar el filtro de rol seleccionado (Todos, Admin, Agricultor)
  filtroRol = 'Todos';
  // Propiedad para almacenar el filtro de estado seleccionado (Todos, Activo, Inactivo, etc.)
  filtroEstado = 'Todos';
  // Propiedad para almacenar el filtro de dispositivo seleccionado (Todos, vinculado, no vinculado)
  filtroDispositivo = 'Todos';
  // Propiedad para almacenar la fecha de inicio del rango de filtrado
  fechaInicio = '';
  // Propiedad para almacenar la fecha de fin del rango de filtrado
  fechaFin = '';
  // Propiedad para almacenar el orden alfabético seleccionado (az o za)
  ordenAlfabetico = 'az';

  // Propiedad para controlar qué modal está activo (registro, editar, perfil o null si ninguno)
  modalModo: ModalModo | null = null;
  // Propiedad para almacenar el usuario seleccionado para editar o ver perfil
  usuarioSeleccionado: UsuarioAdmin | null = null;
  // Propiedad para almacenar el usuario que se está por eliminar (para confirmación)
  usuarioParaEliminar: UsuarioAdmin | null = null;

  // Array que contiene todos los usuarios del sistema (inicializado con datos simulados)
  usuarios: UsuarioAdmin[] = datosSimuladosAdmin;

  // Constructor del componente que se ejecuta al crear la instancia
  constructor() {
    // Mapea todos los usuarios y agrega la propiedad 'dispositivo' solo a los agricultores
    this.usuarios = this.usuarios.map((usuario, index) => ({
      // Copia todas las propiedades existentes del usuario usando el operador spread
      ...usuario,
      // Agrega la propiedad 'dispositivo' solo si el rol es 'Agricultor'
      dispositivo: usuario.rol === 'Agricultor' 
        // El primer agricultor (index 0) tiene dispositivo vinculado, los demás no
        ? (index === 0 ? 'Dispositivo vinculado' : 'Dispositivo no vinculado')
        // Si no es agricultor, la propiedad es undefined
        : undefined
    }));
  }

  // Getter que devuelve la lista de usuarios filtrados y ordenados según los criterios seleccionados
  get usuariosFiltrados(): UsuarioAdmin[] {
    // Normaliza el término de búsqueda para comparación sin acentos ni mayúsculas
    const termino = this.normalizar(this.busqueda);

    // Filtra y ordena los usuarios según los criterios activos
    return this.usuarios
      // Aplica todos los filtros a cada usuario
      .filter((usuario) => {
        // Normaliza el nombre completo del usuario para comparación
        const nombreCompleto = this.normalizar(this.nombreCompleto(usuario));
        // Normaliza el correo electrónico para comparación
        const correo = this.normalizar(usuario.correoElectronico);
        // Verifica si el término de búsqueda está vacío o coincide con nombre o correo
        const coincideBusqueda =
          !termino || nombreCompleto.includes(termino) || correo.includes(termino);
        // Verifica si el filtro de rol está en 'Todos' o coincide con el rol del usuario
        const coincideRol = this.filtroRol === 'Todos' || usuario.rol === this.filtroRol;
        // Verifica si el filtro de estado está en 'Todos' o coincide con cuenta o sesión
        const coincideEstado =
          this.filtroEstado === 'Todos' ||
          usuario.cuenta === this.filtroEstado ||
          usuario.sesion === this.filtroEstado;
        // Verifica si el filtro de dispositivo está en 'Todos' o coincide con el estado del dispositivo
        const coincideDispositivo =
          this.filtroDispositivo === 'Todos' ||
          usuario.dispositivo === this.filtroDispositivo;
        // Verifica si la fecha de registro está dentro del rango seleccionado
        const coincideFecha = this.coincideFecha(usuario.fechaRegistro);

        // Retorna true solo si todos los filtros coinciden
        return coincideBusqueda && coincideRol && coincideEstado && coincideDispositivo && coincideFecha;
      })
      // Ordena los usuarios alfabéticamente por apellidos y nombre
      .sort((a, b) => {
        // Construye el nombre completo con apellidos primero para ordenar correctamente
        const nombreA = `${a.apellido} ${a.segundoApellido} ${a.nombre}`;
        const nombreB = `${b.apellido} ${b.segundoApellido} ${b.nombre}`;
        // Compara los nombres usando localeCompare para manejar caracteres especiales
        const resultado = nombreA.localeCompare(nombreB);

        // Si el orden es 'az', retorna el resultado normal; si es 'za', invierte el resultado
        return this.ordenAlfabetico === 'az' ? resultado : resultado * -1;
      });
  }

  // Getter que calcula el número total de agricultores registrados en el sistema
  get totalAgricultores(): number {
    // Filtra todos los usuarios y cuenta solo los que tienen rol 'Agricultor'
    return this.usuarios.filter((usuario) => usuario.rol === 'Agricultor').length;
  }

  // Getter que calcula el número total de usuarios con sesión activa actualmente
  get totalSesionesActivas(): number {
    // Filtra todos los usuarios y cuenta solo los que tienen sesión 'En linea'
    return this.usuarios.filter((usuario) => usuario.sesion === 'En linea').length;
  }

  // Getter que devuelve el título apropiado para el modal según el modo activo
  get modalTitulo(): string {
    // Si el modo es 'registro', retorna el título para registrar nuevo usuario
    if (this.modalModo === 'registro') {
      return 'Registro de usuario';
    }
    // Si el modo es 'editar', retorna el título para editar usuario
    if (this.modalModo === 'editar') {
      return 'Editar usuario';
    }
    // En cualquier otro caso (modo 'perfil'), retorna el título para ver perfil
    return 'Perfil de usuario';
  }

  // Método que construye el nombre completo de un usuario concatenando todos sus nombres
  nombreCompleto(usuario: UsuarioAdmin): string {
    // Crea un array con todos los nombres, filtra los valores vacíos y los une con espacios
    return [usuario.nombre, usuario.segundoNombre, usuario.apellido, usuario.segundoApellido]
      // Filtra valores falsy (undefined, null, '') usando Boolean como callback
      .filter(Boolean)
      // Une todos los elementos del array con un espacio entre ellos
      .join(' ');
  }

  // Método que extrae las iniciales del nombre y apellido de un usuario
  iniciales(usuario: UsuarioAdmin): string {
    // Obtiene la primera letra del nombre o string vacío si no existe
    const n = usuario.nombre.charAt(0) || '';
    // Obtiene la primera letra del apellido o string vacío si no existe
    const a = usuario.apellido.charAt(0) || '';
    // Concatena ambas letras y las convierte a mayúsculas
    return `${n}${a}`.toUpperCase();
  }

  // Método que abre el modal en modo 'registro' para crear un nuevo usuario
  abrirRegistro(): void {
    // Establece el modo del modal como 'registro'
    this.modalModo = 'registro';
    // Limpia cualquier selección previa de usuario
    this.usuarioSeleccionado = null;
  }

  // Método que abre el modal en modo 'editar' para modificar un usuario existente
  abrirEditar(usuario: UsuarioAdmin): void {
    // Establece el modo del modal como 'editar'
    this.modalModo = 'editar';
    // Almacena el usuario seleccionado para editar
    this.usuarioSeleccionado = usuario;
  }

  // Método que abre el modal en modo 'perfil' para visualizar los datos de un usuario
  abrirPerfil(usuario: UsuarioAdmin): void {
    // Establece el modo del modal como 'perfil'
    this.modalModo = 'perfil';
    // Almacena el usuario seleccionado para visualizar
    this.usuarioSeleccionado = usuario;
  }

  // Método que convierte un objeto UsuarioAdmin a UsuarioEditar para usar en modales
  convertirAUsuarioEditar(usuario: UsuarioAdmin): UsuarioEditar {
    // Retorna un objeto con solo las propiedades editables del usuario
    return {
      // Copia el ID del usuario
      id: usuario.id,
      // Copia el nombre del usuario
      nombre: usuario.nombre,
      // Copia el segundo nombre del usuario
      segundoNombre: usuario.segundoNombre,
      // Copia el apellido del usuario
      apellido: usuario.apellido,
      // Copia el segundo apellido del usuario
      segundoApellido: usuario.segundoApellido,
      // Copia el correo corporativo del usuario
      correoCorporativo: usuario.correoCorporativo,
      // Copia el correo electrónico personal del usuario
      correoElectronico: usuario.correoElectronico,
      // Copia el teléfono del usuario
      telefono: usuario.telefono,
      // Copia el rol del usuario
      rol: usuario.rol,
    };
  }

  // Método que cierra cualquier modal activo y limpia las selecciones
  cerrarModal(): void {
    // Establece el modo del modal como null (ningún modal abierto)
    this.modalModo = null;
    // Limpia la selección del usuario actual
    this.usuarioSeleccionado = null;
  }

  // Método que guarda un nuevo usuario registrado y lo agrega a la lista
  guardarRegistro(datos: DatosUsuario): void {
    // Calcula el siguiente ID disponible buscando el máximo ID existente y sumando 1
    const nuevoId = Math.max(...this.usuarios.map((u) => u.id), 0) + 1;
    // Formatea el teléfono según las reglas de la cartilla (9 dígitos)
    const telefonoCartilla = this.telefonoParaCartilla(datos.telefono);

    // Crea un nuevo array con todos los usuarios existentes más el nuevo usuario
    this.usuarios = [
      // Copia todos los usuarios existentes usando el operador spread
      ...this.usuarios,
      // Agrega el nuevo usuario al final del array
      {
        // Asigna el ID calculado
        id: nuevoId,
        // Asigna el nombre ingresado en el formulario
        nombre: datos.nombre,
        // Asigna el segundo nombre ingresado
        segundoNombre: datos.segundoNombre,
        // Asigna el apellido ingresado
        apellido: datos.apellido,
        // Asigna el segundo apellido ingresado
        segundoApellido: datos.segundoApellido,
        // Asigna el correo corporativo ingresado
        correoCorporativo: datos.correoCorporativo,
        // Asigna el correo electrónico ingresado
        correoElectronico: datos.correoElectronico,
        // Asigna el teléfono formateado
        telefono: telefonoCartilla,
        // Asigna el rol seleccionado
        rol: datos.rol,
        // Establece la cuenta como 'Activo' por defecto
        cuenta: 'Activo',
        // Establece la sesión como 'Sin sesion' por defecto
        sesion: 'Sin sesion',
        // Establece la fecha de registro como la fecha actual en formato ISO (YYYY-MM-DD)
        fechaRegistro: new Date().toISOString().slice(0, 10),
      },
    ];

    // Cierra el modal después de guardar
    this.cerrarModal();
  }

  // Método que guarda las modificaciones realizadas a un usuario existente
  guardarEdicion(datos: DatosUsuario): void {
    // Verifica si hay un usuario seleccionado para editar
    if (!this.usuarioSeleccionado) {
      // Si no hay usuario seleccionado, sale del método sin hacer nada
      return;
    }

    // Formatea el teléfono según las reglas de la cartilla
    const telefonoCartilla = this.telefonoParaCartilla(datos.telefono);

    // Actualiza las propiedades del usuario seleccionado con los nuevos datos
    Object.assign(this.usuarioSeleccionado, {
      // Actualiza el nombre con el valor del formulario
      nombre: datos.nombre,
      // Actualiza el segundo nombre
      segundoNombre: datos.segundoNombre,
      // Actualiza el apellido
      apellido: datos.apellido,
      // Actualiza el segundo apellido
      segundoApellido: datos.segundoApellido,
      // Actualiza el correo corporativo
      correoCorporativo: datos.correoCorporativo,
      // Actualiza el correo electrónico
      correoElectronico: datos.correoElectronico,
      // Actualiza el teléfono con el formato correcto
      telefono: telefonoCartilla,
      // Actualiza el rol del usuario
      rol: datos.rol,
    });

    // Cierra el modal después de guardar los cambios
    this.cerrarModal();
  }

  // Método que cambia el estado de la cuenta de un usuario (Activo <-> Inactivo)
  cambiarEstado(usuario: UsuarioAdmin): void {
    // Alterna el estado de la cuenta: si es 'Activo' lo cambia a 'Inactivo' y viceversa
    usuario.cuenta = usuario.cuenta === 'Activo' ? 'Inactivo' : 'Activo';
    // Si la cuenta queda Inactiva, la sesión se establece como 'Sin sesion'; si es Activa, mantiene su sesión actual
    usuario.sesion = usuario.cuenta === 'Activo' ? usuario.sesion : 'Sin sesion';
  }

  // Método que abre el modal de confirmación para eliminar un usuario
  abrirConfirmacionEliminar(usuario: UsuarioAdmin): void {
    // Almacena el usuario que se desea eliminar para mostrarlo en el modal de confirmación
    this.usuarioParaEliminar = usuario;
  }

  // Método que cierra el modal de confirmación de eliminación sin eliminar
  cerrarConfirmacionEliminar(): void {
    // Limpia la referencia al usuario para eliminar, cerrando el modal
    this.usuarioParaEliminar = null;
  }

  // Método que confirma y ejecuta la eliminación del usuario seleccionado
  confirmarEliminacion(): void {
    // Verifica si hay un usuario marcado para eliminar
    if (!this.usuarioParaEliminar) {
      // Si no hay usuario, sale del método sin hacer nada
      return;
    }

    // Filtra el array de usuarios, manteniendo todos excepto el que se va a eliminar
    this.usuarios = this.usuarios.filter(
      // Mantiene solo los usuarios cuyo ID sea diferente al ID del usuario a eliminar
      (usuario) => usuario.id !== this.usuarioParaEliminar!.id
    );
    // Cierra el modal de confirmación después de eliminar
    this.cerrarConfirmacionEliminar();
  }

  // Método que permite al administrador acceder al panel de un agricultor específico
  accederPanelAgricultor(usuario: UsuarioAdmin): void {
    // Redirige el navegador a la ruta del panel del agricultor
    // TODO: En producción, debería pasar el ID del usuario como parámetro de ruta
    window.location.href = '/panel-agricultor';
  }

  // Método privado que verifica si una fecha de registro está dentro del rango de filtrado
  private coincideFecha(fechaRegistro: string): boolean {
    // Si no hay fechas de inicio ni fin seleccionadas, todas las fechas son válidas
    if (!this.fechaInicio && !this.fechaFin) {
      return true;
    }

    // Convierte la fecha de registro a objeto Date agregando hora 00:00:00
    const fecha = new Date(`${fechaRegistro}T00:00:00`);
    // Convierte la fecha de inicio a Date si existe, o null si no hay filtro de inicio
    const inicio = this.fechaInicio ? new Date(`${this.fechaInicio}T00:00:00`) : null;
    // Convierte la fecha de fin a Date con hora 23:59:59 si existe, o null si no hay filtro de fin
    const fin = this.fechaFin ? new Date(`${this.fechaFin}T23:59:59`) : null;

    // Retorna true si la fecha está dentro del rango: mayor o igual al inicio Y menor o igual al fin
    return (!inicio || fecha >= inicio) && (!fin || fecha <= fin);
  }

  // Método privado que formatea un número de teléfono según las reglas de la cartilla
  private telefonoParaCartilla(telefono: string): string {
    // Elimina todos los caracteres que no sean dígitos del teléfono
    const digitos = telefono.replace(/\D/g, '');
    // Si el teléfono tiene 10 dígitos y empieza con 0, quita el primer dígito
    if (digitos.length === 10 && digitos.startsWith('0')) {
      return digitos.slice(1);
    }
    // En cualquier otro caso, toma solo los primeros 9 dígitos
    return digitos.slice(0, 9);
  }

  // Método privado que normaliza un texto para comparación sin acentos ni mayúsculas
  private normalizar(valor: string): string {
    return valor
      // Convierte todo el texto a minúsculas
      .toLowerCase()
      // Normaliza el texto usando NFD (Canonical Decomposition) para separar caracteres base de diacríticos
      .normalize('NFD')
      // Elimina todos los diacríticos (acentos, tildes) usando una expresión regular
      .replace(/[\u0300-\u036f]/g, '')
      // Elimina espacios en blanco al inicio y al final
      .trim();
  }
}
