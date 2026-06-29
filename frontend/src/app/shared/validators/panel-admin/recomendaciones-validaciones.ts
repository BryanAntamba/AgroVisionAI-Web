// Importa las utilidades necesarias de Angular Forms para crear validaciones personalizadas
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

// Clase que contiene patrones de validación y métodos para validar recomendaciones
// Utiliza métodos estáticos para poder acceder a los validadores sin instanciar la clase
export class RecomendacionesValidaciones {
  // Patrón expresión regular para validar el título de recomendaciones
  // Permite: letras (mayúsculas, minúsculas, acentuadas), números y espacios
  // NO permite caracteres especiales como puntuación, símbolos, etc.
  static readonly TITULO_PATTERN = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ0-9\s]+$/;

  // Patrón expresión regular para validar la descripción de recomendaciones
  // Permite: letras, números, espacios, paréntesis, puntos, comas, dos puntos, símbolos de porcentaje y grado
  // Máximo de 500 caracteres
  // Este patrón es más permisivo que el del título porque descripciones son más largas
  static readonly TEXTO_DESCRIPTIVO_PATTERN =
    /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ0-9\s().,:%°]{1,500}$/;

  // Patrón expresión regular para validar la acción recomendada
  // Permite: letras, números, espacios, paréntesis, puntos, comas, dos puntos, símbolos de porcentaje y grado
  // NO tiene límite de caracteres específico (se controla con maxlength en el formulario)
  static readonly ACCION_PATTERN = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ0-9\s().,:%°]+$/;

  // Método estático que retorna el mensaje de error apropiado para el campo título
  // Recibe el control del formulario y analiza si tiene errores de validación
  static mensajeTitulo(control: AbstractControl | null): string {
    // Si el control no existe, no ha sido tocado o no tiene errores, retorna cadena vacía
    if (!control?.touched || !control.errors) return '';
    // Si el error es 'required', significa que el campo está vacío
    if (control.errors['required']) return 'El título es obligatorio.';
    // Si el error es 'maxlength', significa que se excedió el límite de 100 caracteres
    if (control.errors['maxlength']) return 'Máximo se permite 100 caracteres de ingreso.';
    // Si el error es 'pattern', significa que contiene caracteres no permitidos
    if (control.errors['pattern']) {
      return 'Solo se permiten letras, números y espacios.';
    }
    // Si no hay errores conocidos, retorna cadena vacía
    return '';
  }

  // Método estático que retorna el mensaje de error apropiado para el campo descripción
  // Funciona similar al método anterior pero con reglas específicas para descripción
  static mensajeDescripcion(control: AbstractControl | null): string {
    // Si el control no existe, no ha sido tocado o no tiene errores, retorna cadena vacía
    if (!control?.touched || !control.errors) return '';
    // Si el error es 'required', el campo descripción está vacío
    if (control.errors['required']) return 'La descripción es obligatoria.';
    // Si el error es 'maxlength', se excedió el máximo de 500 caracteres
    if (control.errors['maxlength']) return 'Máximo 500 caracteres.';
    // Si el error es 'pattern', contiene caracteres no permitidos en descripción
    if (control.errors['pattern']) {
      return 'Ingrese una descripcion valida en el campo requerido';
    }
    // Si no hay errores conocidos, retorna cadena vacía
    return '';
  }

  // Método estático que retorna el mensaje de error apropiado para el campo acción
  // Valida que la acción recomendada esté completa y sea válida
  static mensajeAccion(control: AbstractControl | null): string {
    // Si el control no existe, no ha sido tocado o no tiene errores, retorna cadena vacía
    if (!control?.touched || !control.errors) return '';
    // Si el error es 'required', el campo acción está vacío
    if (control.errors['required']) return 'La acción recomendada es obligatoria.';
    // Si el error es 'pattern', contiene caracteres no permitidos en la acción
    if (control.errors['pattern']) {
      return 'Ingrese una descripcion valida en el campo requerido';
    }
    // Si no hay errores conocidos, retorna cadena vacía
    return '';
  }

  // Método estático que retorna el mensaje de error apropiado para campos select/dropdown
  // Recibe el control del formulario y el nombre del campo para personalizar el mensaje
  static mensajeSelect(control: AbstractControl | null, nombre: string): string {
    // Si el control no existe, no ha sido tocado o no tiene errores, retorna cadena vacía
    if (!control?.touched || !control.errors) return '';
    // Si el error es 'required', significa que no se seleccionó ninguna opción
    if (control.errors['required']) return `${nombre} es obligatorio.`;
    // Si no hay errores conocidos, retorna cadena vacía
    return '';
  }

  // Método estático que retorna una función validadora personalizada para prioridad
  // Esta función verifica que se seleccione una prioridad válida (no vacía)
  static prioridadRequerida(): ValidatorFn {
    // Retorna una función que será ejecutada por Angular Forms para validar
    return (control: AbstractControl): ValidationErrors | null => {
      // Obtiene el valor actual del control
      const v = control.value;
      // Verifica que el valor no esté vacío y sea una cadena válida
      // Si es válido (no vacío), retorna null (sin errores)
      // Si es inválido (vacío), retorna objeto con error 'required'
      return v && v !== '' ? null : { required: true };
    };
  }
}
