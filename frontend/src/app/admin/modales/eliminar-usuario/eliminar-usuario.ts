import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UsuarioEditar } from '../editar-usuario/editar-usuario';

@Component({
  selector: 'app-eliminar-usuario',
  imports: [CommonModule],
  templateUrl: './eliminar-usuario.html',
  styleUrl: './eliminar-usuario.css',
})
export class EliminarUsuario {
  @Input() usuario!: UsuarioEditar;
  @Output() cerrar = new EventEmitter<void>();
  @Output() confirmar = new EventEmitter<void>();

  cerrarModal(): void {
    this.cerrar.emit();
  }

  confirmarEliminacion(): void {
    this.confirmar.emit();
  }

  nombreCompleto(): string {
    return [
      this.usuario.nombre,
      this.usuario.segundoNombre,
      this.usuario.apellido,
      this.usuario.segundoApellido,
    ]
      .filter(Boolean)
      .join(' ');
  }
}
