import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class RecomendacionesValidaciones {
  // Patrón para título: solo letras (con acentos), números y espacios
  static readonly TITULO_PATTERN = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ0-9\s]+$/;

  static readonly TEXTO_DESCRIPTIVO_PATTERN =
    /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ0-9\s().,:%°]{1,500}$/;

  static readonly ACCION_PATTERN = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ0-9\s().,:%°]+$/;

  static mensajeTitulo(control: AbstractControl | null): string {
    if (!control?.touched || !control.errors) return '';
    if (control.errors['required']) return 'El título es obligatorio.';
    if (control.errors['maxlength']) return 'Máximo se permite 100 caracteres de ingreso.';
    if (control.errors['pattern']) {
      return 'Solo se permiten letras, números y espacios.';
    }
    return '';
  }

  static mensajeDescripcion(control: AbstractControl | null): string {
    if (!control?.touched || !control.errors) return '';
    if (control.errors['required']) return 'La descripción es obligatoria.';
    if (control.errors['maxlength']) return 'Máximo 500 caracteres.';
    if (control.errors['pattern']) {
      return 'Ingrese una descripcion valida en el campo requerido';
    }
    return '';
  }

  static mensajeAccion(control: AbstractControl | null): string {
    if (!control?.touched || !control.errors) return '';
    if (control.errors['required']) return 'La acción recomendada es obligatoria.';
    if (control.errors['pattern']) {
      return 'Ingrese una descripcion valida en el campo requerido';
    }
    return '';
  }

  static mensajeSelect(control: AbstractControl | null, nombre: string): string {
    if (!control?.touched || !control.errors) return '';
    if (control.errors['required']) return `${nombre} es obligatorio.`;
    return '';
  }

  static prioridadRequerida(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const v = control.value;
      return v && v !== '' ? null : { required: true };
    };
  }
}
