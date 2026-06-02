import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BarraAdmin } from '../../navbars/barra-admin/barra-admin';
import { DatosUsuario } from '../modales/registro-usuario/registro-usuario';
import { RegistroUsuario } from '../modales/registro-usuario/registro-usuario';
import { EditarUsuario, UsuarioEditar } from '../modales/editar-usuario/editar-usuario';
import { PerfilUsuario } from '../modales/perfil-usuario/perfil-usuario';
import { EliminarUsuario } from '../modales/eliminar-usuario/eliminar-usuario';
import { datosSimuladosAdmin, UsuarioAdmin as UsuarioAdminInterface } from '../../../environments/datos-simulados-admin';

type RolUsuario = 'Admin' | 'Agricultor';
type EstadoCuenta = 'Activo' | 'Inactivo';
type EstadoSesion = 'En linea' | 'Sin sesion';
type EstadoDispositivo = 'Dispositivo vinculado' | 'Dispositivo no vinculado';
type ModalModo = 'registro' | 'editar' | 'perfil';

interface UsuarioAdmin {
  id: number;
  nombre: string;
  segundoNombre: string;
  apellido: string;
  segundoApellido: string;
  correoCorporativo: string;
  correoElectronico: string;
  telefono: string;
  rol: RolUsuario;
  cuenta: EstadoCuenta;
  sesion: EstadoSesion;
  dispositivo?: EstadoDispositivo;
  fechaRegistro: string;
}

@Component({
  selector: 'app-panel-admin',
  imports: [
    CommonModule,
    FormsModule,
    BarraAdmin,
    RegistroUsuario,
    EditarUsuario,
    PerfilUsuario,
    EliminarUsuario,
  ],
  templateUrl: './panel-admin.html',
  styleUrl: './panel-admin.css',
})
export class PanelAdmin {
  busqueda = '';
  filtroRol = 'Todos';
  filtroEstado = 'Todos';
  fechaInicio = '';
  fechaFin = '';
  ordenAlfabetico = 'az';

  modalModo: ModalModo | null = null;
  usuarioSeleccionado: UsuarioAdmin | null = null;
  usuarioParaEliminar: UsuarioAdmin | null = null;

  usuarios: UsuarioAdmin[] = datosSimuladosAdmin;

  constructor() {
    // Agregar estado de dispositivo a agricultores
    this.usuarios = this.usuarios.map((usuario, index) => ({
      ...usuario,
      dispositivo: usuario.rol === 'Agricultor' 
        ? (index === 0 ? 'Dispositivo vinculado' : 'Dispositivo no vinculado')
        : undefined
    }));
  }

  get usuariosFiltrados(): UsuarioAdmin[] {
    const termino = this.normalizar(this.busqueda);

    return this.usuarios
      .filter((usuario) => {
        const nombreCompleto = this.normalizar(this.nombreCompleto(usuario));
        const correo = this.normalizar(usuario.correoElectronico);
        const coincideBusqueda =
          !termino || nombreCompleto.includes(termino) || correo.includes(termino);
        const coincideRol = this.filtroRol === 'Todos' || usuario.rol === this.filtroRol;
        const coincideEstado =
          this.filtroEstado === 'Todos' ||
          usuario.cuenta === this.filtroEstado ||
          usuario.sesion === this.filtroEstado;
        const coincideFecha = this.coincideFecha(usuario.fechaRegistro);

        return coincideBusqueda && coincideRol && coincideEstado && coincideFecha;
      })
      .sort((a, b) => {
        const nombreA = `${a.apellido} ${a.segundoApellido} ${a.nombre}`;
        const nombreB = `${b.apellido} ${b.segundoApellido} ${b.nombre}`;
        const resultado = nombreA.localeCompare(nombreB);

        return this.ordenAlfabetico === 'az' ? resultado : resultado * -1;
      });
  }

  get totalAgricultores(): number {
    return this.usuarios.filter((usuario) => usuario.rol === 'Agricultor').length;
  }

  get totalSesionesActivas(): number {
    return this.usuarios.filter((usuario) => usuario.sesion === 'En linea').length;
  }

  get modalTitulo(): string {
    if (this.modalModo === 'registro') {
      return 'Registro de usuario';
    }
    if (this.modalModo === 'editar') {
      return 'Editar usuario';
    }
    return 'Perfil de usuario';
  }

  nombreCompleto(usuario: UsuarioAdmin): string {
    return [usuario.nombre, usuario.segundoNombre, usuario.apellido, usuario.segundoApellido]
      .filter(Boolean)
      .join(' ');
  }

  iniciales(usuario: UsuarioAdmin): string {
    const n = usuario.nombre.charAt(0) || '';
    const a = usuario.apellido.charAt(0) || '';
    return `${n}${a}`.toUpperCase();
  }

  abrirRegistro(): void {
    this.modalModo = 'registro';
    this.usuarioSeleccionado = null;
  }

  abrirEditar(usuario: UsuarioAdmin): void {
    this.modalModo = 'editar';
    this.usuarioSeleccionado = usuario;
  }

  abrirPerfil(usuario: UsuarioAdmin): void {
    this.modalModo = 'perfil';
    this.usuarioSeleccionado = usuario;
  }

  convertirAUsuarioEditar(usuario: UsuarioAdmin): UsuarioEditar {
    return {
      id: usuario.id,
      nombre: usuario.nombre,
      segundoNombre: usuario.segundoNombre,
      apellido: usuario.apellido,
      segundoApellido: usuario.segundoApellido,
      correoCorporativo: usuario.correoCorporativo,
      correoElectronico: usuario.correoElectronico,
      telefono: usuario.telefono,
      rol: usuario.rol,
    };
  }

  cerrarModal(): void {
    this.modalModo = null;
    this.usuarioSeleccionado = null;
  }

  guardarRegistro(datos: DatosUsuario): void {
    const nuevoId = Math.max(...this.usuarios.map((u) => u.id), 0) + 1;
    const telefonoCartilla = this.telefonoParaCartilla(datos.telefono);

    this.usuarios = [
      ...this.usuarios,
      {
        id: nuevoId,
        nombre: datos.nombre,
        segundoNombre: datos.segundoNombre,
        apellido: datos.apellido,
        segundoApellido: datos.segundoApellido,
        correoCorporativo: datos.correoCorporativo,
        correoElectronico: datos.correoElectronico,
        telefono: telefonoCartilla,
        rol: datos.rol,
        cuenta: 'Activo',
        sesion: 'Sin sesion',
        fechaRegistro: new Date().toISOString().slice(0, 10),
      },
    ];

    this.cerrarModal();
  }

  guardarEdicion(datos: DatosUsuario): void {
    if (!this.usuarioSeleccionado) {
      return;
    }

    const telefonoCartilla = this.telefonoParaCartilla(datos.telefono);

    Object.assign(this.usuarioSeleccionado, {
      nombre: datos.nombre,
      segundoNombre: datos.segundoNombre,
      apellido: datos.apellido,
      segundoApellido: datos.segundoApellido,
      correoCorporativo: datos.correoCorporativo,
      correoElectronico: datos.correoElectronico,
      telefono: telefonoCartilla,
      rol: datos.rol,
    });

    this.cerrarModal();
  }

  cambiarEstado(usuario: UsuarioAdmin): void {
    usuario.cuenta = usuario.cuenta === 'Activo' ? 'Inactivo' : 'Activo';
    usuario.sesion = usuario.cuenta === 'Activo' ? usuario.sesion : 'Sin sesion';
  }

  abrirConfirmacionEliminar(usuario: UsuarioAdmin): void {
    this.usuarioParaEliminar = usuario;
  }

  cerrarConfirmacionEliminar(): void {
    this.usuarioParaEliminar = null;
  }

  confirmarEliminacion(): void {
    if (!this.usuarioParaEliminar) {
      return;
    }

    this.usuarios = this.usuarios.filter(
      (usuario) => usuario.id !== this.usuarioParaEliminar!.id
    );
    this.cerrarConfirmacionEliminar();
  }

  accederPanelAgricultor(usuario: UsuarioAdmin): void {
    // Navegar al panel del agricultor
    window.location.href = '/panel-agricultor';
  }

  private coincideFecha(fechaRegistro: string): boolean {
    if (!this.fechaInicio && !this.fechaFin) {
      return true;
    }

    const fecha = new Date(`${fechaRegistro}T00:00:00`);
    const inicio = this.fechaInicio ? new Date(`${this.fechaInicio}T00:00:00`) : null;
    const fin = this.fechaFin ? new Date(`${this.fechaFin}T23:59:59`) : null;

    return (!inicio || fecha >= inicio) && (!fin || fecha <= fin);
  }

  private telefonoParaCartilla(telefono: string): string {
    const digitos = telefono.replace(/\D/g, '');
    if (digitos.length === 10 && digitos.startsWith('0')) {
      return digitos.slice(1);
    }
    return digitos.slice(0, 9);
  }

  private normalizar(valor: string): string {
    return valor
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim();
  }
}
