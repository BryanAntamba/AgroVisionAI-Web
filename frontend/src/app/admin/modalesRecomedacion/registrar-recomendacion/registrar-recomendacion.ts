// Importa el módulo común de Angular con directivas básicas
import { CommonModule } from '@angular/common';
// Importa decoradores para componentes y eventos de salida
import { Component, EventEmitter, Output } from '@angular/core';
// Importa clases para trabajar con formularios reactivos
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
// Importa las opciones de colores, prioridades y tipos desde el módulo de configuración
import {
  COLORES_OPCIONES,
  PrioridadRecomendacion,
  ColorRecomendacion,
  PRIORIDADES_OPCIONES,
} from '../../../../environments/modales-recomendacion';
// Importa validaciones personalizadas para formularios de recomendaciones
import { RecomendacionesValidaciones } from '../../../shared/validators/panel-admin/recomendaciones-validaciones';

// Interfaz que define la estructura de datos del formulario de recomendación
export interface DatosRecomendacionForm {
  titulo: string; // Título de la recomendación
  descripcion: string; // Descripción detallada
  accion: string; // Acción recomendada a tomar
  prioridad: PrioridadRecomendacion; // Nivel de prioridad (Baja, Media, Alta, Crítica)
  color: ColorRecomendacion; // Color asociado (Verde, Amarillo, Naranja, Rojo)
}

// Decorador que define este componente de Angular
@Component({
  selector: 'app-registrar-recomendacion', // Selector HTML para usar este componente
  imports: [CommonModule, ReactiveFormsModule], // Módulos necesarios: directivas y formularios reactivos
  templateUrl: './registrar-recomendacion.html', // Ruta al archivo de template HTML
  styleUrls: [ // Array de hojas de estilo
    './registrar-recomendacion.css', // Estilos específicos del componente
    '../../../shared/validators/styles/validacion-errores.css', // Estilos compartidos para errores de validación
  ],
})
// Clase del componente para registrar nuevas recomendaciones
export class RegistrarRecomendacion {
  // Evento de salida para notificar al padre cuando se debe cerrar el modal
  @Output() cerrar = new EventEmitter<void>();
  // Evento de salida que envía los datos de la nueva recomendación al componente padre
  @Output() guardar = new EventEmitter<DatosRecomendacionForm>();

  // Formulario reactivo que maneja todos los campos de la recomendación
  form: FormGroup;
  // Array de opciones de prioridad disponibles
  prioridades = PRIORIDADES_OPCIONES;
  // Array de opciones de color disponibles
  colores = COLORES_OPCIONES;
  // Referencia a la clase de validaciones para usar en el template
  validaciones = RecomendacionesValidaciones;

  // Constructor que inyecta FormBuilder para construir el formulario
  constructor(private fb: FormBuilder) {
    // Crea el formulario con todos los campos y sus respectivas validaciones
    this.form = this.fb.group({
      // Campo título: requerido, máximo 100 caracteres, patrón de título
      titulo: ['', [Validators.required, Validators.maxLength(100), Validators.pattern(RecomendacionesValidaciones.TITULO_PATTERN)]],
      // Campo descripción: requerido, máximo 500 caracteres, patrón descriptivo
      descripcion: [
        '',
        [Validators.required, Validators.maxLength(500), Validators.pattern(RecomendacionesValidaciones.TEXTO_DESCRIPTIVO_PATTERN)],
      ],
      // Campo acción: requerido, patrón de acción
      accion: ['', [Validators.required, Validators.pattern(RecomendacionesValidaciones.ACCION_PATTERN)]],
      // Campo prioridad: requerido
      prioridad: ['', Validators.required],
      // Campo color: requerido
      color: ['', Validators.required],
    });
  }

  // Getter que proporciona acceso simplificado a los controles del formulario
  get f() {
    return this.form.controls;
  }

  // Método que emite el evento de cierre del modal sin guardar
  cerrarModal(): void {
    this.cerrar.emit();
  }

  // Método que maneja el envío del formulario de registro
  enviar(): void {
    // Verifica si el formulario tiene errores de validación
    if (this.form.invalid) {
      // Marca todos los campos como tocados para mostrar mensajes de error
      this.form.markAllAsTouched();
      return; // Sale del método sin guardar
    }
    // Emite el evento de guardar con los datos del formulario convertidos al tipo correcto
    this.guardar.emit(this.form.value as DatosRecomendacionForm);
  }
}
