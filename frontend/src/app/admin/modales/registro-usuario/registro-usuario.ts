import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormValidators } from '../../../shared/validators/form-validators';

export interface DatosUsuario {
  nombre: string;
  segundoNombre: string;
  apellido: string;
  segundoApellido: string;
  correoCorporativo: string;
  correoElectronico: string;
  telefono: string;
  password: string;
  rol: 'Admin' | 'Agricultor';
}

@Component({
  selector: 'app-registro-usuario',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './registro-usuario.html',
  styleUrl: './registro-usuario.css',
})
export class RegistroUsuario {
  @Output() cerrar = new EventEmitter<void>();
  @Output() guardar = new EventEmitter<DatosUsuario>();

  usuarioForm: FormGroup;
  showPassword = false;
  showConfirmPassword = false;

  constructor(private fb: FormBuilder) {
    this.usuarioForm = this.crearFormulario();
  }

  get f() {
    return this.usuarioForm.controls;
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  cerrarModal(): void {
    this.cerrar.emit();
  }

  guardarUsuario(): void {
    if (this.usuarioForm.invalid) {
      this.usuarioForm.markAllAsTouched();
      return;
    }

    const valores = this.usuarioForm.getRawValue();
    this.guardar.emit({
      nombre: valores.nombre?.trim() || '',
      segundoNombre: valores.segundoNombre?.trim() || '',
      apellido: valores.apellido?.trim() || '',
      segundoApellido: valores.segundoApellido?.trim() || '',
      correoCorporativo: valores.correoCorporativo.trim(),
      correoElectronico: valores.correoElectronico.trim(),
      telefono: valores.telefono,
      password: valores.password,
      rol: valores.rol,
    });
  }

  private crearFormulario(): FormGroup {
    return this.fb.group(
      {
        nombre: ['', [Validators.pattern(FormValidators.NOMBRE_PATTERN)]],
        segundoNombre: ['', [Validators.pattern(FormValidators.NOMBRE_PATTERN)]],
        apellido: ['', [Validators.pattern(FormValidators.NOMBRE_PATTERN)]],
        segundoApellido: ['', [Validators.pattern(FormValidators.NOMBRE_PATTERN)]],
        correoCorporativo: [
          '',
          [Validators.required, Validators.pattern(FormValidators.CORREO_CORPORATIVO_PATTERN)],
        ],
        correoElectronico: [
          '',
          [Validators.required, Validators.pattern(FormValidators.CORREO_GMAIL_PATTERN)],
        ],
        telefono: ['', [Validators.required, Validators.pattern(FormValidators.TELEFONO_PATTERN)]],
        password: ['', [Validators.required]],
        confirmarPassword: ['', [Validators.required]],
        rol: ['', [Validators.required]],
      },
      { validators: FormValidators.passwordsCoinciden() }
    );
  }
}
