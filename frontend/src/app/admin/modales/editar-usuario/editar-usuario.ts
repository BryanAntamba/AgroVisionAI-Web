import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormValidators } from '../../../shared/validators/form-validators';
import { DatosUsuario } from '../registro-usuario/registro-usuario';

export interface UsuarioEditar {
  id: number;
  nombre: string;
  segundoNombre: string;
  apellido: string;
  segundoApellido: string;
  correoCorporativo: string;
  correoElectronico: string;
  telefono: string;
  rol: 'Admin' | 'Agricultor';
}

@Component({
  selector: 'app-editar-usuario',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './editar-usuario.html',
  styleUrl: './editar-usuario.css',
})
export class EditarUsuario implements OnInit {
  @Input() usuario!: UsuarioEditar;
  @Output() cerrar = new EventEmitter<void>();
  @Output() guardar = new EventEmitter<DatosUsuario>();

  usuarioForm: FormGroup;
  showPassword = false;
  showConfirmPassword = false;

  constructor(private fb: FormBuilder) {
    this.usuarioForm = this.crearFormulario();
  }

  ngOnInit(): void {
    if (this.usuario) {
      this.usuarioForm.patchValue({
        nombre: this.usuario.nombre,
        segundoNombre: this.usuario.segundoNombre,
        apellido: this.usuario.apellido,
        segundoApellido: this.usuario.segundoApellido,
        correoCorporativo: this.usuario.correoCorporativo,
        correoElectronico: this.usuario.correoElectronico,
        telefono: this.telefonoParaFormulario(this.usuario.telefono),
        password: 'AgroVision2026!',
        confirmarPassword: 'AgroVision2026!',
        rol: this.usuario.rol,
      });
    }
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

  private telefonoParaFormulario(telefono: string): string {
    const digitos = telefono.replace(/\D/g, '');
    return digitos.length === 9 ? `0${digitos}` : digitos;
  }
}
