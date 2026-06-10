// Importa el módulo común de Angular con directivas básicas como *ngIf, *ngFor
import { CommonModule } from '@angular/common';
// Importa decoradores para componentes y eventos de salida
import { Component, EventEmitter, Output } from '@angular/core';
// Importa clases para trabajar con formularios reactivos de Angular
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
// Importa validaciones personalizadas para formularios de modales
import { ModalesValidaciones } from '../../../shared/validators/modales-validaciones';

// Interfaz que define la estructura de datos del usuario a registrar
export interface DatosUsuario {
  nombre: string; // Primer nombre del usuario
  segundoNombre: string; // Segundo nombre (opcional)
  apellido: string; // Primer apellido
  segundoApellido: string; // Segundo apellido (opcional)
  correoCorporativo: string; // Email corporativo (@agrovision.com)
  correoElectronico: string; // Email personal (@gmail.com)
  telefono: string; // Número de teléfono (10 dígitos)
  password: string; // Contraseña del usuario
  rol: 'Admin' | 'Agricultor'; // Rol del usuario (solo dos opciones posibles)
}

// Decorador que define este componente de Angular
@Component({
  selector: 'app-registro-usuario', // Selector HTML para usar este componente
  imports: [CommonModule, ReactiveFormsModule], // Módulos necesarios: directivas y formularios reactivos
  templateUrl: './registro-usuario.html', // Ruta al archivo de template HTML
  styleUrls: [ // Array de hojas de estilo
    './registro-usuario.css', // Estilos específicos del componente
    '../../../shared/validators/styles/validacion-errores.css' // Estilos compartidos para mensajes de error de validación
  ],
})
// Clase del componente para el registro de nuevos usuarios
export class RegistroUsuario {
  // Evento de salida para notificar al componente padre que se debe cerrar el modal
  @Output() cerrar = new EventEmitter<void>();
  // Evento de salida que envía los datos del nuevo usuario al componente padre
  @Output() guardar = new EventEmitter<DatosUsuario>();

  // Formulario reactivo que maneja todos los campos del registro
  usuarioForm: FormGroup;
  // Bandera para alternar la visibilidad del campo de contraseña entre texto y password
  showPassword = false;
  // Bandera para alternar la visibilidad del campo de confirmación de contraseña
  showConfirmPassword = false;

  // Constructor que inyecta FormBuilder para construir el formulario
  constructor(private fb: FormBuilder) {
    // Inicializa el formulario al crear la instancia del componente
    this.usuarioForm = this.crearFormulario();
  }

  // Getter que proporciona acceso simplificado a los controles del formulario
  get f() {
    return this.usuarioForm.controls;
  }

  // Método que alterna la visibilidad del campo de contraseña entre texto plano y oculto
  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  // Método que alterna la visibilidad del campo de confirmación de contraseña
  toggleConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  // Método que emite el evento de cierre del modal sin guardar cambios
  cerrarModal(): void {
    this.cerrar.emit();
  }

  // Método que maneja el envío del formulario de registro
  guardarUsuario(): void {
    // Verifica si el formulario tiene errores de validación
    if (this.usuarioForm.invalid) {
      // Marca todos los campos como tocados para mostrar todos los mensajes de error
      this.usuarioForm.markAllAsTouched();
      return; // Sale del método sin guardar
    }

    // Obtiene todos los valores del formulario
    const valores = this.usuarioForm.getRawValue();
    // Emite el evento de guardar con los datos procesados y limpiados
    this.guardar.emit({
      nombre: valores.nombre?.trim() || '', // Elimina espacios en blanco o usa cadena vacía
      segundoNombre: valores.segundoNombre?.trim() || '', // Elimina espacios en blanco o usa cadena vacía
      apellido: valores.apellido?.trim() || '', // Elimina espacios en blanco o usa cadena vacía
      segundoApellido: valores.segundoApellido?.trim() || '', // Elimina espacios en blanco o usa cadena vacía
      correoCorporativo: valores.correoCorporativo.trim(), // Elimina espacios en blanco
      correoElectronico: valores.correoElectronico.trim(), // Elimina espacios en blanco
      telefono: valores.telefono, // Número de teléfono sin modificar
      password: valores.password, // Contraseña sin modificar
      rol: valores.rol, // Rol seleccionado (Admin o Agricultor)
    });
  }

  // Método privado que crea y configura el formulario reactivo con todas sus validaciones
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
        // Campo correo corporativo: requerido y debe terminar en @agrovision.com
        correoCorporativo: [
          '',
          [Validators.required, Validators.pattern(ModalesValidaciones.CORREO_CORPORATIVO_PATTERN)],
        ],
        // Campo correo electrónico personal: requerido y debe terminar en @gmail.com
        correoElectronico: [
          '',
          [Validators.required, Validators.pattern(ModalesValidaciones.CORREO_GMAIL_PATTERN)],
        ],
        // Campo teléfono: requerido y debe ser exactamente 10 dígitos numéricos
        telefono: ['', [Validators.required, Validators.pattern(ModalesValidaciones.TELEFONO_PATTERN)]],
        // Campo contraseña: requerido
        password: ['', [Validators.required]],
        // Campo confirmación de contraseña: requerido
        confirmarPassword: ['', [Validators.required]],
        // Campo rol: requerido (Admin o Agricultor)
        rol: ['', [Validators.required]],
      },
      // Validador personalizado a nivel de formulario que verifica que las dos contraseñas coincidan
      { validators: ModalesValidaciones.passwordsCoinciden() }
    );
  }
}
