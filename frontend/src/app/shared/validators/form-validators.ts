import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Validadores reutilizables para formularios de la aplicación
 */
export class FormValidators {
  /**
   * Patrón para validar nombres (solo letras, espacios y caracteres especiales en español)
   */
  static readonly NOMBRE_PATTERN = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]*$/;

  /**
   * Patrón para validar correos corporativos (@agrovision.com)
   */
  static readonly CORREO_CORPORATIVO_PATTERN = /^[a-zA-Z0-9._%+-]+@agrovision\.com$/;

  /**
   * Patrón para validar correos de Gmail (@gmail.com)
   */
  static readonly CORREO_GMAIL_PATTERN = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

  /**
   * Patrón para validar teléfonos (10 dígitos)
   */
  static readonly TELEFONO_PATTERN = /^[0-9]{10}$/;

  /**
   * Patrón para validar códigos de verificación (6 dígitos)
   */
  static readonly CODIGO_VERIFICACION_PATTERN = /^[0-9]{6}$/;

  /**
   * Validador para verificar que dos contraseñas coincidan
   * @param passwordField Nombre del campo de contraseña
   * @param confirmPasswordField Nombre del campo de confirmación
   * @returns ValidatorFn
   */
  static passwordsCoinciden(
    passwordField: string = 'password',
    confirmPasswordField: string = 'confirmarPassword'
  ): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const password = control.get(passwordField)?.value;
      const confirmPassword = control.get(confirmPasswordField)?.value;

      if (!password || !confirmPassword) {
        return null;
      }

      return password === confirmPassword ? null : { passwordMismatch: true };
    };
  }

  /**
   * Validador alternativo para contraseñas que no coinciden
   * @param control AbstractControl
   * @returns ValidationErrors | null
   */
  static passwordsNoCoinciden(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    if (!password || !confirmPassword) {
      return null;
    }

    return password === confirmPassword ? null : { passwordsNoCoinciden: true };
  }

  /**
   * Mensajes de error predefinidos para validaciones comunes
   */
  static readonly MENSAJES_ERROR = {
    required: 'Este campo es obligatorio',
    nombrePattern: 'Solo se permiten letras',
    correoCorporativoRequired: 'El correo corporativo es obligatorio',
    correoCorporativoPattern: 'Debe terminar en @agrovision.com',
    correoElectronicoRequired: 'El correo electrónico es obligatorio',
    correoGmailPattern: 'Debe terminar en @gmail.com',
    telefonoRequired: 'El teléfono es obligatorio',
    telefonoPattern: 'Ingrese exactamente 10 dígitos numéricos',
    passwordRequired: 'La contraseña es obligatoria',
    confirmarPasswordRequired: 'Debe confirmar la contraseña',
    passwordMismatch: 'Las contraseñas no coinciden',
    passwordsNoCoinciden: 'Las contraseñas no coinciden',
    codigoPattern: 'El código debe tener 6 dígitos',
  };
}
