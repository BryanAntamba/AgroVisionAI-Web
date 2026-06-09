// Importa el módulo común de Angular que incluye directivas básicas
import { CommonModule } from '@angular/common';
// Importa los decoradores necesarios para crear componentes, manejar entradas/salidas y hooks de ciclo de vida
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
// Importa clases para crear y manejar formularios reactivos en Angular
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
// Importa la clase de validaciones personalizadas para los formularios de modales
import { ModalesValidaciones } from '../../../shared/validators/modales-validaciones';
// Importa la interfaz que define la estructura de datos del usuario a editar
import { UsuarioEditar } from '../editar-usuario/editar-usuario';

// Decorador que define este componente de Angular
@Component({
  selector: 'app-perfil-usuario', // Selector HTML para invocar este componente
  imports: [CommonModule, ReactiveFormsModule], // Módulos necesarios: directivas comunes y formularios reactivos
  templateUrl: './perfil-usuario.html', // Ruta del archivo de template HTML
  styleUrls: [ // Array de rutas de hojas de estilo
    './perfil-usuario.css', // Estilos específicos del componente
    '../../../shared/styles/validacion-errores.css' // Estilos compartidos para errores de validación
  ],
})
// Clase del componente que implementa la interfaz OnInit para inicialización
export class PerfilUsuario implements OnInit {
  // Propiedad de entrada que recibe los datos del usuario desde el componente padre
  @Input() usuario!: UsuarioEditar;
  // Evento de salida para notificar al padre que se debe cerrar el modal
  @Output() cerrar = new EventEmitter<void>();

  // Formulario reactivo que contendrá todos los campos del perfil
  usuarioForm: FormGroup;
  // Bandera para controlar la visibilidad de la contraseña
  showPassword = false;
  // Bandera para controlar la visibilidad del campo de confirmación de contraseña
  showConfirmPassword = false;

  // Constructor que inyecta el FormBuilder para crear formularios
  constructor(private fb: FormBuilder) {
    // Inicializa el formulario al crear la instancia del componente
    this.usuarioForm = this.crearFormulario();
  }

  // Hook de ciclo de vida que se ejecuta después de que Angular inicializa las propiedades del componente
  ngOnInit(): void {
    // Verifica si se recibió un usuario
    if (this.usuario) {
      // Rellena el formulario con los datos del usuario
      this.usuarioForm.patchValue({
        nombre: this.usuario.nombre, // Primer nombre
        segundoNombre: this.usuario.segundoNombre, // Segundo nombre
        apellido: this.usuario.apellido, // Primer apellido
        segundoApellido: this.usuario.segundoApellido, // Segundo apellido
        correoCorporativo: this.usuario.correoCorporativo, // Email corporativo
        correoElectronico: this.usuario.correoElectronico, // Email personal
        telefono: this.telefonoParaFormulario(this.usuario.telefono), // Teléfono formateado
        password: 'AgroVision2026!', // Contraseña de placeholder
        confirmarPassword: 'AgroVision2026!', // Confirmación de contraseña de placeholder
        rol: this.usuario.rol, // Rol del usuario (Admin o Agricultor)
      });
      // Deshabilita todo el formulario para que sea de solo lectura
      this.usuarioForm.disable();
    }
  }

  // Getter que proporciona acceso rápido a los controles del formulario
  get f() {
    return this.usuarioForm.controls;
  }

  // Método que emite el evento de cierre del modal
  cerrarModal(): void {
    this.cerrar.emit();
  }

  // Método privado que crea y configura el formulario reactivo con todas sus validaciones
  private crearFormulario(): FormGroup {
    return this.fb.group(
      {
        // Campo de nombre con validación de patrón (solo letras)
        nombre: ['', [Validators.pattern(ModalesValidaciones.NOMBRE_PATTERN)]],
        // Campo de segundo nombre con validación de patrón (solo letras)
        segundoNombre: ['', [Validators.pattern(ModalesValidaciones.NOMBRE_PATTERN)]],
        // Campo de apellido con validación de patrón (solo letras)
        apellido: ['', [Validators.pattern(ModalesValidaciones.NOMBRE_PATTERN)]],
        // Campo de segundo apellido con validación de patrón (solo letras)
        segundoApellido: ['', [Validators.pattern(ModalesValidaciones.NOMBRE_PATTERN)]],
        // Campo de correo corporativo: requerido y debe terminar en @agrovision.com
        correoCorporativo: [
          '',
          [Validators.required, Validators.pattern(ModalesValidaciones.CORREO_CORPORATIVO_PATTERN)],
        ],
        // Campo de correo electrónico personal: requerido y debe terminar en @gmail.com
        correoElectronico: [
          '',
          [Validators.required, Validators.pattern(ModalesValidaciones.CORREO_GMAIL_PATTERN)],
        ],
        // Campo de teléfono: requerido y debe tener 10 dígitos
        telefono: ['', [Validators.required, Validators.pattern(ModalesValidaciones.TELEFONO_PATTERN)]],
        // Campo de contraseña: requerido
        password: ['', [Validators.required]],
        // Campo de confirmación de contraseña: requerido
        confirmarPassword: ['', [Validators.required]],
        // Campo de rol: requerido (Admin o Agricultor)
        rol: ['', [Validators.required]],
      },
      // Validador personalizado a nivel de formulario que verifica que las contraseñas coincidan
      { validators: ModalesValidaciones.passwordsCoinciden() }
    );
  }

  // Método privado que formatea el teléfono para el formulario
  private telefonoParaFormulario(telefono: string): string {
    // Elimina todos los caracteres que no sean dígitos
    const digitos = telefono.replace(/\D/g, '');
    // Si tiene 9 dígitos, agrega un 0 al inicio; de lo contrario, devuelve los dígitos tal cual
    return digitos.length === 9 ? `0${digitos}` : digitos;
  }
}
