// Importa el módulo común de Angular que proporciona directivas básicas como *ngIf, *ngFor
import { CommonModule } from '@angular/common';
// Importa los decoradores Component, EventEmitter, Input y Output necesarios para crear componentes de Angular
import { Component, EventEmitter, Input, Output } from '@angular/core';
// Importa la interfaz UsuarioEditar desde el componente hermano editar-usuario
import { UsuarioEditar } from '../editar-usuario/editar-usuario';

// Decorador que define este componente de Angular
@Component({
  selector: 'app-eliminar-usuario', // Selector HTML que se usará para invocar este componente
  imports: [CommonModule], // Importa CommonModule para usar directivas de Angular en el template
  templateUrl: './eliminar-usuario.html', // Ruta al archivo HTML del template
  styleUrl: './eliminar-usuario.css', // Ruta al archivo CSS de estilos
})
// Clase que define el componente modal de eliminación de usuario
export class EliminarUsuario {
  // Propiedad de entrada que recibe los datos del usuario a eliminar desde el componente padre
  @Input() usuario!: UsuarioEditar;
  // Evento de salida que notifica al componente padre cuando se debe cerrar el modal
  @Output() cerrar = new EventEmitter<void>();
  // Evento de salida que notifica al componente padre cuando el usuario confirma la eliminación
  @Output() confirmar = new EventEmitter<void>();

  // Método que emite el evento de cierre del modal
  cerrarModal(): void {
    this.cerrar.emit();
  }

  // Método que emite el evento de confirmación de eliminación
  confirmarEliminacion(): void {
    this.confirmar.emit();
  }

  // Método que construye el nombre completo del usuario concatenando todos sus nombres y apellidos
  nombreCompleto(): string {
    return [
      this.usuario.nombre, // Primer nombre
      this.usuario.segundoNombre, // Segundo nombre (opcional)
      this.usuario.apellido, // Primer apellido
      this.usuario.segundoApellido, // Segundo apellido (opcional)
    ]
      .filter(Boolean) // Filtra valores nulos, undefined o cadenas vacías
      .join(' '); // Une los valores con un espacio entre ellos
  }
}
