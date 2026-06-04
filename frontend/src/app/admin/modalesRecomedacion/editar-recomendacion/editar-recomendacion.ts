import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DesplegableCampo } from '../desplegable-campo/desplegable-campo';
import {
  COLORES_OPCIONES,
  PRIORIDADES_OPCIONES,
  RecomendacionRegistrada,
} from '../../../../environments/modales-recomendacion';
import { RecomendacionesValidaciones } from '../../../shared/validators/panel-admin/recomendaciones-validaciones';
import { DatosRecomendacionForm } from '../registrar-recomendacion/registrar-recomendacion';

@Component({
  selector: 'app-editar-recomendacion',
  imports: [CommonModule, ReactiveFormsModule, DesplegableCampo],
  templateUrl: './editar-recomendacion.html',
  styleUrls: [
    '../../modales/registro-usuario/registro-usuario.css',
    '../registrar-recomendacion/registrar-recomendacion.css',
    '../../../shared/styles/validacion-errores.css',
  ],
})
export class EditarRecomendacion implements OnChanges {
  @Input({ required: true }) recomendacion!: RecomendacionRegistrada;
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

  ngOnChanges(): void {
    if (this.recomendacion) {
      this.form.patchValue({
        titulo: this.recomendacion.titulo,
        descripcion: this.recomendacion.descripcion,
        accion: this.recomendacion.accion,
        prioridad: this.recomendacion.prioridad,
        color: this.recomendacion.color,
      });
    }
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
