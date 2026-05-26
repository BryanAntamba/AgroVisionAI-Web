import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { BarraAdmin } from '../../nadvars/barra-admin/barra-admin';

type RolUsuario = 'Admin' | 'Agricultor';
type EstadoCuenta = 'Activo' | 'Inactivo';
type EstadoSesion = 'En linea' | 'Sin sesion';
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
  fechaRegistro: string;
}

@Component({
  selector: 'app-panel-admin',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, BarraAdmin],
  templateUrl: './panel-admin.html',
  styleUrl: './panel-admin.css',
})
export class PanelAdmin {
  private readonly nombrePattern = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]*$/;
  private readonly correoCorporativoPattern = /^[a-zA-Z0-9._%+-]+@agrovision\.com$/;
  private readonly correoGmailPattern = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
  private readonly telefonoPattern = /^[0-9]{10}$/;

  busqueda = '';
  filtroRol = 'Todos';
  filtroEstado = 'Todos';
  fechaInicio = '';
  fechaFin = '';
  ordenAlfabetico = 'az';

  modalModo: ModalModo | null = null;
  usuarioSeleccionado: UsuarioAdmin | null = null;
  showPassword = false;
  showConfirmPassword = false;

  usuarioForm: FormGroup;

  usuarios: UsuarioAdmin[] = [
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

  constructor(private fb: FormBuilder) {
    this.usuarioForm = this.crearFormularioUsuario();
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

  get esSoloLectura(): boolean {
    return this.modalModo === 'perfil';
  }

  get f() {
    return this.usuarioForm.controls;
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
    this.usuarioForm = this.crearFormularioUsuario();
    this.showPassword = false;
    this.showConfirmPassword = false;
  }

  abrirEditar(usuario: UsuarioAdmin): void {
    this.modalModo = 'editar';
    this.usuarioSeleccionado = usuario;
    this.usuarioForm = this.crearFormularioUsuario();
    this.usuarioForm.patchValue({
      nombre: usuario.nombre,
      segundoNombre: usuario.segundoNombre,
      apellido: usuario.apellido,
      segundoApellido: usuario.segundoApellido,
      correoCorporativo: usuario.correoCorporativo,
      correoElectronico: usuario.correoElectronico,
      telefono: this.telefonoParaFormulario(usuario.telefono),
      password: 'AgroVision2026!',
      confirmarPassword: 'AgroVision2026!',
      rol: usuario.rol,
    });
    this.showPassword = false;
    this.showConfirmPassword = false;
  }

  abrirPerfil(usuario: UsuarioAdmin): void {
    this.modalModo = 'perfil';
    this.usuarioSeleccionado = usuario;
    this.usuarioForm = this.crearFormularioUsuario();
    this.usuarioForm.patchValue({
      nombre: usuario.nombre,
      segundoNombre: usuario.segundoNombre,
      apellido: usuario.apellido,
      segundoApellido: usuario.segundoApellido,
      correoCorporativo: usuario.correoCorporativo,
      correoElectronico: usuario.correoElectronico,
      telefono: this.telefonoParaFormulario(usuario.telefono),
      password: 'AgroVision2026!',
      confirmarPassword: 'AgroVision2026!',
      rol: usuario.rol,
    });
    this.usuarioForm.disable();
    this.showPassword = false;
    this.showConfirmPassword = false;
  }

  cerrarModal(): void {
    this.modalModo = null;
    this.usuarioSeleccionado = null;
    this.usuarioForm.enable();
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  guardarUsuario(): void {
    if (this.esSoloLectura) {
      return;
    }

    if (this.usuarioForm.invalid) {
      this.usuarioForm.markAllAsTouched();
      return;
    }

    const valores = this.usuarioForm.getRawValue();
    const telefonoCartilla = this.telefonoParaCartilla(String(valores.telefono));

    if (this.modalModo === 'registro') {
      const nuevoId = Math.max(...this.usuarios.map((u) => u.id), 0) + 1;
      this.usuarios = [
        ...this.usuarios,
        {
          id: nuevoId,
          nombre: valores.nombre?.trim() || '',
          segundoNombre: valores.segundoNombre?.trim() || '',
          apellido: valores.apellido?.trim() || '',
          segundoApellido: valores.segundoApellido?.trim() || '',
          correoCorporativo: valores.correoCorporativo.trim(),
          correoElectronico: valores.correoElectronico.trim(),
          telefono: telefonoCartilla,
          rol: valores.rol,
          cuenta: 'Activo',
          sesion: 'Sin sesion',
          fechaRegistro: new Date().toISOString().slice(0, 10),
        },
      ];
    }

    if (this.modalModo === 'editar' && this.usuarioSeleccionado) {
      Object.assign(this.usuarioSeleccionado, {
        nombre: valores.nombre?.trim() || '',
        segundoNombre: valores.segundoNombre?.trim() || '',
        apellido: valores.apellido?.trim() || '',
        segundoApellido: valores.segundoApellido?.trim() || '',
        correoCorporativo: valores.correoCorporativo.trim(),
        correoElectronico: valores.correoElectronico.trim(),
        telefono: telefonoCartilla,
        rol: valores.rol,
      });
    }

    this.cerrarModal();
  }

  cambiarEstado(usuario: UsuarioAdmin): void {
    usuario.cuenta = usuario.cuenta === 'Activo' ? 'Inactivo' : 'Activo';
    usuario.sesion = usuario.cuenta === 'Activo' ? usuario.sesion : 'Sin sesion';
  }

  eliminarUsuario(usuario: UsuarioAdmin): void {
    usuario.cuenta = 'Inactivo';
    usuario.sesion = 'Sin sesion';
  }

  private crearFormularioUsuario(): FormGroup {
    return this.fb.group(
      {
        nombre: ['', [Validators.pattern(this.nombrePattern)]],
        segundoNombre: ['', [Validators.pattern(this.nombrePattern)]],
        apellido: ['', [Validators.pattern(this.nombrePattern)]],
        segundoApellido: ['', [Validators.pattern(this.nombrePattern)]],
        correoCorporativo: [
          '',
          [Validators.required, Validators.pattern(this.correoCorporativoPattern)],
        ],
        correoElectronico: [
          '',
          [Validators.required, Validators.pattern(this.correoGmailPattern)],
        ],
        telefono: ['', [Validators.required, Validators.pattern(this.telefonoPattern)]],
        password: ['', [Validators.required]],
        confirmarPassword: ['', [Validators.required]],
        rol: ['', [Validators.required]],
      },
      { validators: this.validarContrasenasCoinciden }
    );
  }

  private validarContrasenasCoinciden(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirmar = group.get('confirmarPassword')?.value;

    if (!password || !confirmar) {
      return null;
    }

    return password === confirmar ? null : { passwordMismatch: true };
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

  private telefonoParaFormulario(telefono: string): string {
    const digitos = telefono.replace(/\D/g, '');
    return digitos.length === 9 ? `0${digitos}` : digitos;
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
