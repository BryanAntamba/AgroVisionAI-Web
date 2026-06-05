import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  COLORES_OPCIONES,
  PrioridadRecomendacion,
  ColorRecomendacion,
  PRIORIDADES_OPCIONES,
} from '../../../../environments/modales-recomendacion';
import { RecomendacionesValidaciones } from '../../../shared/validators/panel-admin/recomendaciones-validaciones';

export interface DatosRecomendacionForm {
  titulo: string;
  descripcion: string;
  accion: string;
  prioridad: PrioridadRecomendacion;
  color: ColorRecomendacion;
}

@Component({
  selector: 'app-registrar-recomendacion',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './registrar-recomendacion.html',
  styleUrls: [
    '../../modales/registro-usuario/registro-usuario.css',
    './registrar-recomendacion.css',
    '../../../shared/styles/validacion-errores.css',
  ],
})
export class RegistrarRecomendacion {
  @Output() cerrar = new EventEmitter<void>();
  @Output() guardar = new EventEmitter<DatosRecomendacionForm>();

  form: FormGroup;
  prioridades = PRIORIDADES_OPCIONES;
  colores = COLORES_OPCIONES;
  validaciones = RecomendacionesValidaciones;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      titulo: ['', [Validators.required, Validators.maxLength(100), Validators.pattern(RecomendacionesValidaciones.TITULO_PATTERN)]],
      descripcion: [
        '',
        [Validators.required, Validators.maxLength(500), Validators.pattern(RecomendacionesValidaciones.TEXTO_DESCRIPTIVO_PATTERN)],
      ],
      accion: ['', [Validators.required, Validators.pattern(RecomendacionesValidaciones.ACCION_PATTERN)]],
      prioridad: ['', Validators.required],
      color: ['', Validators.required],
    });
  }

  get f() {
    return this.form.controls;
  }

  cerrarModal(): void {
    this.cerrar.emit();
  }

  enviar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.guardar.emit(this.form.value as DatosRecomendacionForm);
  }
}
