import { AbstractControl } from '@angular/forms';

export class EdicionPlataformaValidaciones {
  // Patrón para nombre de plataforma: letras, números, espacios, guiones y guiones bajos
  static readonly NOMBRE_PLATAFORMA_PATTERN = /^[A-Za-z0-9\s\-_]+$/;

  // Mensajes de validación para el nombre de la plataforma
  static mensajeNombrePlataforma(control: AbstractControl): string {
    if (!control) return '';

    const errors = control.errors;
    const touched = control.touched;
    const dirty = control.dirty;

    if (!touched && !dirty) return '';

    if (errors?.['required']) {
      return 'El nombre de la plataforma es obligatorio';
    }

    if (errors?.['minlength']) {
      return 'El nombre debe tener al menos 3 caracteres';
    }

    if (errors?.['maxlength']) {
      return 'El nombre no puede superar los 50 caracteres';
    }

    if (errors?.['pattern']) {
      return 'Solo se permiten letras, números, espacios, guiones (-) y guiones bajos (_)';
    }

    return '';
  }

  // Validación para logo (archivo)
  static validarLogo(file: File | null): string {
    if (!file) {
      return 'Debe seleccionar un logo para la plataforma';
    }

    // Validar tipo de archivo
    const tiposPermitidos = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml'];
    if (!tiposPermitidos.includes(file.type)) {
      return 'El logo debe ser una imagen PNG, JPG o SVG';
    }

    // Validar tamaño (máximo 2MB)
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
      return 'El logo no debe superar los 2MB';
    }

    return '';
  }

  // Validación para favicon (archivo)
  static validarFavicon(file: File | null): string {
    if (!file) {
      return 'Debe seleccionar un icono para la pestaña del navegador';
    }

    // Validar tipo de archivo
    const tiposPermitidos = ['image/png', 'image/x-icon', 'image/svg+xml'];
    if (!tiposPermitidos.includes(file.type)) {
      return 'El favicon debe ser una imagen PNG, ICO o SVG';
    }

    // Validar tamaño (máximo 500KB)
    const maxSize = 500 * 1024; // 500KB
    if (file.size > maxSize) {
      return 'El favicon no debe superar los 500KB';
    }

    return '';
  }

  // Validación para imágenes del carrusel
  static validarImagenesCarrusel(imagenes: any[]): string {
    if (!imagenes || imagenes.length === 0) {
      return 'Debe mantener al menos una imagen en el carrusel de autenticación';
    }

    return '';
  }

  // Validación para imagen individual del carrusel
  static validarImagenCarrusel(file: File): string {
    // Validar tipo de archivo
    const tiposPermitidos = ['image/png', 'image/jpeg', 'image/jpg'];
    if (!tiposPermitidos.includes(file.type)) {
      return 'Las imágenes del carrusel deben ser PNG o JPG';
    }

    // Validar tamaño (máximo 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return 'Cada imagen del carrusel no debe superar los 5MB';
    }

    return '';
  }

  // Validación general del formulario
  static validarFormularioCompleto(
    nombrePlataforma: string,
    logoFile: File | null,
    faviconFile: File | null,
    imagenesCarrusel: any[]
  ): { valido: boolean; errores: string[] } {
    const errores: string[] = [];

    // Validar nombre de plataforma
    if (!nombrePlataforma || nombrePlataforma.trim().length === 0) {
      errores.push('El nombre de la plataforma es obligatorio');
    } else if (nombrePlataforma.trim().length < 3) {
      errores.push('El nombre de la plataforma debe tener al menos 3 caracteres');
    } else if (!this.NOMBRE_PLATAFORMA_PATTERN.test(nombrePlataforma)) {
      errores.push('El nombre de la plataforma solo puede contener letras, números, espacios, guiones y guiones bajos');
    }

    // Validar logo (solo si se subió uno nuevo)
    if (logoFile) {
      const errorLogo = this.validarLogo(logoFile);
      if (errorLogo) errores.push(errorLogo);
    }

    // Validar favicon (solo si se subió uno nuevo)
    if (faviconFile) {
      const errorFavicon = this.validarFavicon(faviconFile);
      if (errorFavicon) errores.push(errorFavicon);
    }

    // Validar imágenes del carrusel
    const errorCarrusel = this.validarImagenesCarrusel(imagenesCarrusel);
    if (errorCarrusel) errores.push(errorCarrusel);

    return {
      valido: errores.length === 0,
      errores: errores
    };
  }
}
