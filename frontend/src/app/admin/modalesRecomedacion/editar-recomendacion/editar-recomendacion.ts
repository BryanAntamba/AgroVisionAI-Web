// Importa el módulo común de Angular con directivas básicas
import { CommonModule } from '@angular/common';
// Importa decoradores para componentes, entradas, salidas y detección de cambios
import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
// Importa clases para trabajar con formularios reactivos
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
// Importa las opciones de colores, prioridades e interfaz de recomendación registrada
import {
  COLORES_OPCIONES,
  PRIORIDADES_OPCIONES,
  RecomendacionRegistrada,
} from '../../../../environments/modales-recomendacion';
// Importa validaciones personalizadas para formularios de recomendaciones
import { RecomendacionesValidaciones } from '../../../shared/validators/panel-admin/recomendaciones-validaciones';
// Importa la interfaz de datos del formulario desde el componente de registro
import { DatosRecomendacionForm } from '../registrar-recomendacion/registrar-recomendacion';

// Decorador que define este componente de Angular
@Component({
  selector: 'app-editar-recomendacion', // Selector HTML para usar este componente
  imports: [CommonModule, ReactiveFormsModule], // Módulos necesarios: directivas y formularios reactivos
  templateUrl: './editar-recomendacion.html', // Ruta al archivo de template HTML
  styleUrls: [ // Array de hojas de estilo
    './editar-recomendacion.css', // Estilos específicos del componente
    '../../../shared/validators/styles/validacion-errores.css', // Estilos compartidos para errores de validación
  ],
})
// Clase del componente que implementa OnChanges para detectar cambios en las propiedades de entrada
export class EditarRecomendacion implements OnChanges {
  // Propiedad de entrada requerida que recibe la recomendación a editar desde el componente padre
  @Input({ required: true }) recomendacion!: RecomendacionRegistrada;
  // Evento de salida para notificar al padre cuando se debe cerrar el modal
  @Output() cerrar = new EventEmitter<void>();
  // Evento de salida que envía los datos editados de la recomendación al componente padre
  @Output() guardar = new EventEmitter<DatosRecomendacionForm>();

  // Formulario reactivo que maneja todos los campos de la recomendación
  form: FormGroup;
  // Array de opciones de prioridad disponibles (Baja, Media, Alta, Crítica)
  prioridades = PRIORIDADES_OPCIONES;
  // Array de opciones de color disponibles (Verde, Amarillo, Naranja, Rojo)
  colores = COLORES_OPCIONES;
  // Referencia a la clase de validaciones para usar en el template
  validaciones = RecomendacionesValidaciones;

  // Constructor que inyecta FormBuilder para construir el formulario
  constructor(private fb: FormBuilder) {
    // Crea el formulario con todos los campos y sus respectivas validaciones
    this.form = this.fb.group({
      // Campo título: requerido, máximo 100 caracteres, patrón específico
      titulo: ['', [Validators.required, Validators.maxLength(100), Validators.pattern(RecomendacionesValidaciones.TITULO_PATTERN)]],
      // Campo descripción: requerido, máximo 500 caracteres, patrón descriptivo
      descripcion: [
        '',
        [Validators.required, Validators.maxLength(500), Validators.pattern(RecomendacionesValidaciones.TEXTO_DESCRIPTIVO_PATTERN)],
      ],
      // Campo acción: requerido, patrón de acción
      accion: ['', [Validators.required, Validators.pattern(RecomendacionesValidaciones.ACCION_PATTERN)]],
      // Campo prioridad: requerido (Baja, Media, Alta, Crítica)
      prioridad: ['', Validators.required],
      // Campo color: requerido (Verde, Amarillo, Naranja, Rojo)
      color: ['', Validators.required],
    });
  }

  // Hook de ciclo de vida que se ejecuta cuando cambian las propiedades de entrada
  ngOnChanges(): void {
    // Verifica si se recibió una recomendación
    if (this.recomendacion) {
      // Rellena el formulario con los datos actuales de la recomendación
      this.form.patchValue({
        titulo: this.recomendacion.titulo, // Título de la recomendación
        descripcion: this.recomendacion.descripcion, // Descripción detallada
        accion: this.recomendacion.accion, // Acción recomendada
        prioridad: this.recomendacion.prioridad, // Nivel de prioridad
        color: this.recomendacion.color, // Color de la recomendación
      });
    }
  }

  // Getter que proporciona acceso simplificado a los controles del formulario
  get f() {
    return this.form.controls;
  }

  // Método que emite el evento de cierre del modal sin guardar cambios
  cerrarModal(): void {
    this.cerrar.emit();
  }

  // Método que maneja el envío del formulario de edición
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
