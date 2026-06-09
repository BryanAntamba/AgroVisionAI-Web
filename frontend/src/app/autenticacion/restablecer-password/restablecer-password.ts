// Importación de módulos básicos
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

// Importación de validadores globales
import { ModalesValidaciones } from '../../shared/validators/modales-validaciones';
import { AutenticacionValidaciones } from '../../shared/validators/autenticacion-validaciones';

// Importación de los componentes de cada paso del proceso
import { CambiarPassword } from '../cambiar-password/cambiar-password';
import { CodigoVerificacion } from '../codigo-verificacion/codigo-verificacion';
import { PasswordConfirmacion } from '../confirmacion/password-confirmacion/password-confirmacion';

// Decorador con la configuración del componente
@Component({
  selector: 'app-restablecer-password', // Identificador HTML
  // Importa todos los subcomponentes necesarios para los diferentes pasos
  imports: [CommonModule, ReactiveFormsModule, CodigoVerificacion, CambiarPassword, PasswordConfirmacion],
  templateUrl: './restablecer-password.html',
  styleUrls: [
    './restablecer-password.css',
    '../../shared/styles/validacion-errores.css',
    '../../shared/styles/animaciones-autenticacion.css'
  ],
})
export class RestablecerPassword {
  // Evento para notificar al componente Login que se debe cerrar este flujo
  @Output() volverLogin = new EventEmitter<void>();

  // Formulario reactivo para solicitar el correo electrónico
  resetForm: FormGroup;
  // Mensaje de error local para cuando el correo no existe o es inválido
  resetError = '';
  // Guarda el correo temporalmente tras validarlo en el primer paso
  correoVerificado = '';
  // Variable de control de estado: define qué pantalla del flujo se está mostrando
  paso: 'correo' | 'codigo' | 'password' | 'finalizado' = 'correo';

  // Correo hardcodeado ("quemado") que simula existir en base de datos para pruebas
  readonly correoSimulado = 'usuario@gmail.com';
  // Exposición de validadores para la plantilla
  validators = AutenticacionValidaciones;

  // Inyección de dependencias
  constructor(private fb: FormBuilder) {
    // Configuración inicial del formulario
    this.resetForm = this.fb.group({
      email: [
        '', // Valor inicial vacío
        // Validaciones: obligatorio y solo correos @gmail.com
        [Validators.required, Validators.pattern(ModalesValidaciones.CORREO_GMAIL_PATTERN)],
      ],
    });
  }

  // Getter auxiliar para el control de email
  get emailControl() {
    return this.resetForm.get('email');
  }

  // Función ejecutada en el Paso 1: Valida el correo y avanza al envío de código
  enviarCodigo(): void {
    this.resetError = ''; // Limpia errores

    // Si el formato del correo no es válido, marca los campos para mostrar el error
    if (this.resetForm.invalid) {
      this.resetForm.markAllAsTouched();
      return;
    }

    // Validación simulada: compara si el correo ingresado coincide con el de prueba
    if (this.resetForm.value.email !== this.correoSimulado) {
      this.resetError = 'El correo no coincide con el usuario simulado.';
      return;
    }

    // Si es correcto, guarda el correo y avanza al Paso 2 (código de verificación)
    this.correoVerificado = this.resetForm.value.email;
    this.paso = 'codigo';
  }

  // Función ejecutada desde el hijo (codigo-verificacion) para avanzar al Paso 3
  mostrarCambioPassword(): void {
    this.paso = 'password';
  }

  // Función ejecutada desde el hijo (cambiar-password) para avanzar al último paso
  finalizarCambio(): void {
    this.paso = 'finalizado';
  }

  // Función para regresar desde el paso de código al paso inicial de correo
  volverACorreo(): void {
    this.paso = 'correo'; // Regresa al primer estado
    this.correoVerificado = ''; // Limpia la variable guardada
    this.resetError = ''; // Limpia el mensaje de error
    this.resetForm.reset(); // Vuelve el formulario a blanco
  }

  // Función para cancelar el proceso en cualquier momento y regresar al Login
  regresarALogin(): void {
    this.volverLogin.emit(); // Emite el evento que escucha el componente padre (Login)
  }

  // Función dummy que se invoca cuando el hijo pide reenviar el código de verificación
  reenviarCodigoVerificacion(): void {
    console.log('Reenviando código de verificación a:', this.correoVerificado);
    // Aquí iría la lógica HTTP real para enviar un correo mediante el backend
  }
}
