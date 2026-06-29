// Importa el módulo común de Angular con directivas básicas
import { CommonModule } from '@angular/common';
// Importa decoradores para componentes, eventos, entradas/salidas y hooks de ciclo de vida
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
// Importa clases para trabajar con formularios reactivos
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
// Importa validaciones personalizadas para los formularios de modales
import { ModalesValidaciones } from '../../../shared/validators/modales-validaciones';
// Importa la interfaz DatosUsuario desde el componente de registro
import { DatosUsuario } from '../registro-usuario/registro-usuario';

// Interfaz que define la estructura de datos del usuario a editar
export interface UsuarioEditar {
  id: number; // Identificador único del usuario
  nombre: string; // Primer nombre
  segundoNombre: string; // Segundo nombre (opcional)
  apellido: string; // Primer apellido
  segundoApellido: string; // Segundo apellido (opcional)
  correoCorporativo: string; // Email corporativo (@agrovision.com)
  correoElectronico: string; // Email personal (@gmail.com)
  telefono: string; // Número de teléfono (10 dígitos)
  rol: 'Admin' | 'Agricultor'; // Rol del usuario (solo dos opciones posibles)
}

// Decorador que define este componente de Angular
@Component({
  selector: 'app-editar-usuario', // Selector HTML para usar este componente
  imports: [CommonModule, ReactiveFormsModule], // Módulos necesarios: directivas y formularios reactivos
  templateUrl: './editar-usuario.html', // Ruta al archivo de template HTML
  styleUrls: [ // Array de hojas de estilo
    './editar-usuario.css', // Estilos específicos del componente
    '../../../shared/validators/styles/validacion-errores.css' // Estilos compartidos para mensajes de error
  ],
})
// Clase del componente que implementa OnInit para lógica de inicialización
export class EditarUsuario implements OnInit {
  // Propiedad de entrada que recibe el usuario a editar desde el componente padre
  @Input() usuario!: UsuarioEditar;
  // Evento de salida para notificar al padre cuando se debe cerrar el modal
  @Output() cerrar = new EventEmitter<void>();
  // Evento de salida para notificar al padre cuando se guardan los cambios, enviando los nuevos datos
  @Output() guardar = new EventEmitter<DatosUsuario>();

  // Formulario reactivo que maneja todos los campos del usuario
  usuarioForm: FormGroup;
  // Bandera para alternar la visibilidad del campo de contraseña
  showPassword = false;
  // Bandera para alternar la visibilidad del campo de confirmación de contraseña
  showConfirmPassword = false;

  // Constructor que inyecta FormBuilder para construir el formulario
  constructor(private fb: FormBuilder) {
    // Inicializa el formulario al crear la instancia
    this.usuarioForm = this.crearFormulario();
  }

  // Hook de ciclo de vida que se ejecuta al inicializar el componente
  ngOnInit(): void {
    // Verifica si se recibió un usuario para editar
    if (this.usuario) {
      // Rellena los campos del formulario con los datos del usuario
      this.usuarioForm.patchValue({
        nombre: this.usuario.nombre, // Primer nombre
        segundoNombre: this.usuario.segundoNombre, // Segundo nombre
        apellido: this.usuario.apellido, // Primer apellido
        segundoApellido: this.usuario.segundoApellido, // Segundo apellido
        correoCorporativo: this.usuario.correoCorporativo, // Email corporativo
        correoElectronico: this.usuario.correoElectronico, // Email personal
        telefono: this.telefonoParaFormulario(this.usuario.telefono), // Teléfono formateado
        password: 'AgroVision2026!', // Contraseña predeterminada de placeholder
        confirmarPassword: 'AgroVision2026!', // Confirmación de contraseña de placeholder
        rol: this.usuario.rol, // Rol del usuario
      });
    }
  }

  // Getter que proporciona acceso simplificado a los controles del formulario
  get f() {
    return this.usuarioForm.controls;
  }

  // Método que alterna la visibilidad del campo de contraseña entre texto y password
  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  // Método que alterna la visibilidad del campo de confirmación de contraseña
  toggleConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  // Método que emite el evento de cierre del modal
  cerrarModal(): void {
    this.cerrar.emit();
  }

  // Método que maneja el guardado del usuario editado
  guardarUsuario(): void {
    // Verifica si el formulario es inválido
    if (this.usuarioForm.invalid) {
      // Marca todos los campos como tocados para mostrar mensajes de error
      this.usuarioForm.markAllAsTouched();
      return; // Sale del método sin guardar
    }

    // Obtiene todos los valores del formulario, incluso los deshabilitados
    const valores = this.usuarioForm.getRawValue();
    // Emite el evento de guardar con los datos procesados
    this.guardar.emit({
      nombre: valores.nombre?.trim() || '', // Elimina espacios en blanco o usa cadena vacía
      segundoNombre: valores.segundoNombre?.trim() || '', // Elimina espacios en blanco o usa cadena vacía
      apellido: valores.apellido?.trim() || '', // Elimina espacios en blanco o usa cadena vacía
      segundoApellido: valores.segundoApellido?.trim() || '', // Elimina espacios en blanco o usa cadena vacía
      correoCorporativo: valores.correoCorporativo.trim(), // Elimina espacios en blanco
      correoElectronico: valores.correoElectronico.trim(), // Elimina espacios en blanco
      telefono: valores.telefono, // Número de teléfono sin modificar
      password: valores.password, // Contraseña sin modificar
      rol: valores.rol, // Rol seleccionado
    });
  }

  // Método privado que crea y configura el formulario reactivo con sus validadores
  private crearFormulario(): FormGroup {
    return this.fb.group(
      {
        // Campo nombre: solo letras permitidas según el patrón de validación
        nombre: ['', [Validators.pattern(ModalesValidaciones.NOMBRE_PATTERN)]],
        // Campo segundo nombre: solo letras permitidas
        segundoNombre: ['', [Validators.pattern(ModalesValidaciones.NOMBRE_PATTERN)]],
        // Campo apellido: solo letras permitidas
        apellido: ['', [Validators.pattern(ModalesValidaciones.NOMBRE_PATTERN)]],
        // Campo segundo apellido: solo letras permitidas
        segundoApellido: ['', [Validators.pattern(ModalesValidaciones.NOMBRE_PATTERN)]],
        // Campo correo corporativo: requerido y debe cumplir patrón @agrovision.com
        correoCorporativo: [
          '',
          [Validators.required, Validators.pattern(ModalesValidaciones.CORREO_CORPORATIVO_PATTERN)],
        ],
        // Campo correo electrónico: requerido y debe cumplir patrón @gmail.com
        correoElectronico: [
          '',
          [Validators.required, Validators.pattern(ModalesValidaciones.CORREO_GMAIL_PATTERN)],
        ],
        // Campo teléfono: requerido y debe ser exactamente 10 dígitos
        telefono: ['', [Validators.required, Validators.pattern(ModalesValidaciones.TELEFONO_PATTERN)]],
        // Campo contraseña: requerido
        password: ['', [Validators.required]],
        // Campo confirmación de contraseña: requerido
        confirmarPassword: ['', [Validators.required]],
        // Campo rol: requerido (Admin o Agricultor)
        rol: ['', [Validators.required]],
      },
      // Validador a nivel de formulario que verifica que ambas contraseñas coincidan
      { validators: ModalesValidaciones.passwordsCoinciden() }
    );
  }

  // Método privado que formatea el número de teléfono para mostrarlo en el formulario
  private telefonoParaFormulario(telefono: string): string {
    // Extrae solo los dígitos numéricos del teléfono
    const digitos = telefono.replace(/\D/g, '');
    // Si tiene 9 dígitos, agrega un 0 al inicio; de lo contrario devuelve tal cual
    return digitos.length === 9 ? `0${digitos}` : digitos;
  }
}
