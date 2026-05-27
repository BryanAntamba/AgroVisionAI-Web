import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalesValidaciones } from '../../../shared/validators/modales-validaciones';
import { UsuarioEditar } from '../editar-usuario/editar-usuario';

@Component({
  selector: 'app-perfil-usuario',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './perfil-usuario.html',
  styleUrls: [
    './perfil-usuario.css',
    '../../../shared/styles/validacion-errores.css'
  ],
})
export class PerfilUsuario implements OnInit {
  @Input() usuario!: UsuarioEditar;
  @Output() cerrar = new EventEmitter<void>();

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
      this.usuarioForm.disable();
    }
  }

  get f() {
    return this.usuarioForm.controls;
  }

  cerrarModal(): void {
    this.cerrar.emit();
  }

  private crearFormulario(): FormGroup {
    return this.fb.group(
      {
        nombre: ['', [Validators.pattern(ModalesValidaciones.NOMBRE_PATTERN)]],
        segundoNombre: ['', [Validators.pattern(ModalesValidaciones.NOMBRE_PATTERN)]],
        apellido: ['', [Validators.pattern(ModalesValidaciones.NOMBRE_PATTERN)]],
        segundoApellido: ['', [Validators.pattern(ModalesValidaciones.NOMBRE_PATTERN)]],
        correoCorporativo: [
          '',
          [Validators.required, Validators.pattern(ModalesValidaciones.CORREO_CORPORATIVO_PATTERN)],
        ],
        correoElectronico: [
          '',
          [Validators.required, Validators.pattern(ModalesValidaciones.CORREO_GMAIL_PATTERN)],
        ],
        telefono: ['', [Validators.required, Validators.pattern(ModalesValidaciones.TELEFONO_PATTERN)]],
        password: ['', [Validators.required]],
        confirmarPassword: ['', [Validators.required]],
        rol: ['', [Validators.required]],
      },
      { validators: ModalesValidaciones.passwordsCoinciden() }
    );
  }

  private telefonoParaFormulario(telefono: string): string {
    const digitos = telefono.replace(/\D/g, '');
    return digitos.length === 9 ? `0${digitos}` : digitos;
  }
}
