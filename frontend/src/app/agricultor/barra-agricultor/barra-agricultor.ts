import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-barra-agricultor',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './barra-agricultor.html',
  styleUrl: './barra-agricultor.css',
})
export class BarraAgricultor {
  constructor(private router: Router) {}

  cerrarSesion(): void {
    // Apagar el dispositivo al cerrar sesión
    localStorage.setItem('dispositivoConectado', 'false');
    localStorage.setItem('dispositivoDesconectado', 'true');
    
    // Navegar a login
    this.router.navigate(['/login']);
  }
}
