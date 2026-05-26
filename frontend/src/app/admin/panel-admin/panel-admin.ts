import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BarraAdmin } from '../../nadvars/barra-admin/barra-admin';

type RolUsuario = 'Admin' | 'Agricultor';
type EstadoCuenta = 'Activo' | 'Inactivo';
type EstadoSesion = 'En linea' | 'Sin sesion';

interface UsuarioAdmin {
  id: number;
  nombres: string;
  apellidos: string;
  correo: string;
  rol: RolUsuario;
  cuenta: EstadoCuenta;
  sesion: EstadoSesion;
  fechaRegistro: string;
  telefono: string;
  ubicacion: string;
  cultivos: string;
}

@Component({
  selector: 'app-panel-admin',
  imports: [CommonModule, FormsModule, BarraAdmin],
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

  usuarios: UsuarioAdmin[] = [
    {
      id: 1,
      nombres: 'Carlos Andres',
      apellidos: 'Mendoza Ruiz',
      correo: 'carlos.mendoza@gmail.com',
      rol: 'Agricultor',
      cuenta: 'Activo',
      sesion: 'En linea',
      fechaRegistro: '2026-05-18',
      telefono: '099-452-1188',
      ubicacion: 'Quito, Pichincha',
      cultivos: 'Tomate rinon',
    },
    {
      id: 2,
      nombres: 'Mariana Isabel',
      apellidos: 'Lopez Vera',
      correo: 'mariana.lopez@gmail.com',
      rol: 'Agricultor',
      cuenta: 'Inactivo',
      sesion: 'Sin sesion',
      fechaRegistro: '2026-04-28',
      telefono: '098-214-6701',
      ubicacion: 'Ambato, Tungurahua',
      cultivos: 'Tomate cherry',
    },
    {
      id: 3,
      nombres: 'Jose Miguel',
      apellidos: 'Cabrera Solis',
      correo: 'jose.cabrera@agrovision.com',
      rol: 'Admin',
      cuenta: 'Activo',
      sesion: 'En linea',
      fechaRegistro: '2026-03-12',
      telefono: '097-335-8902',
      ubicacion: 'Cuenca, Azuay',
      cultivos: 'Supervision general',
    },
    {
      id: 4,
      nombres: 'Daniela Sofia',
      apellidos: 'Paredes Mora',
      correo: 'daniela.paredes@gmail.com',
      rol: 'Agricultor',
      cuenta: 'Activo',
      sesion: 'Sin sesion',
      fechaRegistro: '2026-02-07',
      telefono: '096-881-2034',
      ubicacion: 'Ibarra, Imbabura',
      cultivos: 'Tomate de mesa',
    },
    {
      id: 5,
      nombres: 'Luis Fernando',
      apellidos: 'Aguirre Torres',
      correo: 'luis.aguirre@agrovision.com',
      rol: 'Admin',
      cuenta: 'Inactivo',
      sesion: 'Sin sesion',
      fechaRegistro: '2025-12-21',
      telefono: '095-114-7790',
      ubicacion: 'Guayaquil, Guayas',
      cultivos: 'Auditoria de usuarios',
    },
    {
      id: 6,
      nombres: 'Valeria Emilia',
      apellidos: 'Sanchez Castro',
      correo: 'valeria.sanchez@gmail.com',
      rol: 'Agricultor',
      cuenta: 'Activo',
      sesion: 'En linea',
      fechaRegistro: '2026-01-15',
      telefono: '099-780-4432',
      ubicacion: 'Latacunga, Cotopaxi',
      cultivos: 'Tomate industrial',
    },
  ];

  get usuariosFiltrados(): UsuarioAdmin[] {
    const termino = this.normalizar(this.busqueda);

    return this.usuarios
      .filter((usuario) => {
        const nombreCompleto = this.normalizar(`${usuario.nombres} ${usuario.apellidos}`);
        const correo = this.normalizar(usuario.correo);
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
        const nombreA = `${a.apellidos} ${a.nombres}`;
        const nombreB = `${b.apellidos} ${b.nombres}`;
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

  cambiarEstado(usuario: UsuarioAdmin): void {
    usuario.cuenta = usuario.cuenta === 'Activo' ? 'Inactivo' : 'Activo';
    usuario.sesion = usuario.cuenta === 'Activo' ? usuario.sesion : 'Sin sesion';
  }

  eliminarUsuario(usuario: UsuarioAdmin): void {
    usuario.cuenta = 'Inactivo';
    usuario.sesion = 'Sin sesion';
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

  private normalizar(valor: string): string {
    return valor
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim();
  }
}
