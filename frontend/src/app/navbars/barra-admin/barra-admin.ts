// Importa el decorador Component para definir un componente Angular
import { Component } from '@angular/core';
// Importa RouterLink para habilitar navegación mediante enlaces de rutas
import { RouterLink } from '@angular/router';

// Decorador @Component que define los metadatos del componente de barra de navegación del admin
@Component({
  // Selector CSS para usar este componente como <app-barra-admin>
  selector: 'app-barra-admin',
  // Indica que este componente es standalone (no requiere NgModule)
  standalone: true,
  // Array de módulos y directivas que puede usar en su template
  imports: [RouterLink],
  // Ruta al archivo HTML del template
  templateUrl: './barra-admin.html',
  // Ruta al archivo CSS de estilos
  styleUrl: './barra-admin.css',
})
// Clase del componente BarraAdmin (sin lógica adicional, solo presentación)
export class BarraAdmin {}
