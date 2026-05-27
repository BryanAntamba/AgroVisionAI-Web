import { AbstractControl, ValidationErrors } from '@angular/forms';
import { ModalesValidaciones } from './modales-validaciones';

/**
 * Validadores y helpers específicos para componentes de autenticación
 */
export class AutenticacionValidaciones {
  /**
   * Mensajes de error para el componente de Login
   */
  static readonly LOGIN_ERRORS = {
    emailRequired: 'El correo es obligatorio',
    emailPattern: 'Ingrese un correo válido',
    passwordRequired: 'La contraseña es obligatoria',
  };

  /**
   * Mensajes de error para el componente de Cambiar Password
   */
  static readonly CAMBIAR_PASSWORD_ERRORS = {
    passwordRequired: 'La contraseña es obligatoria',
    confirmPasswordRequired: 'Confirma la contraseña',
    passwordsNoCoinciden: 'Las contraseñas no coinciden',
  };

  /**
   * Mensajes de error para el componente de Código Verificación
   */
  static readonly CODIGO_VERIFICACION_ERRORS = {
    codigoRequired: 'El código es obligatorio',
    codigoPattern: 'Ingresa exactamente 6 números',
    codigoReenviado: 'Codigo reenviado',
    limiteReenvios: 'Has alcanzado el límite de reenvíos.\nInténtalo nuevamente en 15 minutos.',
  };

  static readonly MAX_REENVIOS_CODIGO = 5;

  /**
   * Mensajes de error para el componente de Restablecer Password
   */
  static readonly RESTABLECER_PASSWORD_ERRORS = {
    emailRequired: 'El correo es obligatorio',
    emailPattern: 'Ingrese un correo Gmail válido',
  };

  /**
   * Obtiene el mensaje de error para un control de email en login
   */
  static getLoginEmailError(control: AbstractControl | null): string {
    if (!control || !control.touched || !control.errors) {
      return '';
    }

    if (control.errors['required']) {
      return this.LOGIN_ERRORS.emailRequired;
    }

    if (control.errors['pattern']) {
      return this.LOGIN_ERRORS.emailPattern;
    }

    return '';
  }

  /**
   * Obtiene el mensaje de error para un control de password en login
   */
  static getLoginPasswordError(control: AbstractControl | null): string {
    if (!control || !control.touched || !control.errors) {
      return '';
    }

    if (control.errors['required']) {
      return this.LOGIN_ERRORS.passwordRequired;
    }

    return '';
  }

  /**
   * Obtiene el mensaje de error para el campo de nueva contraseña
   */
  static getCambiarPasswordError(control: AbstractControl | null): string {
    if (!control || !control.touched || !control.errors) {
      return '';
    }

    if (control.errors['required']) {
      return this.CAMBIAR_PASSWORD_ERRORS.passwordRequired;
    }

    return '';
  }

  /**
   * Obtiene el mensaje de error para el campo de confirmar contraseña
   */
  static getConfirmarPasswordError(
    control: AbstractControl | null,
    form: AbstractControl | null
  ): string {
    if (!control || !control.touched) {
      return '';
    }

    if (control.errors?.['required']) {
      return this.CAMBIAR_PASSWORD_ERRORS.confirmPasswordRequired;
    }

    if (form?.errors?.['passwordsNoCoinciden'] && !control.errors?.['required']) {
      return this.CAMBIAR_PASSWORD_ERRORS.passwordsNoCoinciden;
    }

    return '';
  }

  /**
   * Obtiene el mensaje de error para el código de verificación
   */
  static getCodigoVerificacionError(control: AbstractControl | null): string {
    if (!control || !control.touched || !control.errors) {
      return '';
    }

    if (control.errors['required']) {
      return this.CODIGO_VERIFICACION_ERRORS.codigoRequired;
    }

    if (control.errors['pattern']) {
      return this.CODIGO_VERIFICACION_ERRORS.codigoPattern;
    }

    return '';
  }

  static puedeReenviarCodigo(intentos: number): boolean {
    return intentos < this.MAX_REENVIOS_CODIGO;
  }

  static getCodigoReenvioMensaje(intentos: number): string {
    if (intentos <= this.MAX_REENVIOS_CODIGO) {
      return this.CODIGO_VERIFICACION_ERRORS.codigoReenviado;
    }

    return this.CODIGO_VERIFICACION_ERRORS.limiteReenvios;
  }

  /**
   * Obtiene el mensaje de error para el email en restablecer password
   */
  static getRestablecerPasswordEmailError(control: AbstractControl | null): string {
    if (!control || !control.touched || !control.errors) {
      return '';
    }

    if (control.errors['required']) {
      return this.RESTABLECER_PASSWORD_ERRORS.emailRequired;
    }

    if (control.errors['pattern']) {
      return this.RESTABLECER_PASSWORD_ERRORS.emailPattern;
    }

    return '';
  }

  /**
   * Validador para contraseñas que no coinciden (usado en cambiar-password)
   */
  static passwordsNoCoinciden(control: AbstractControl): ValidationErrors | null {
    return ModalesValidaciones.passwordsNoCoinciden(control);
  }
}
