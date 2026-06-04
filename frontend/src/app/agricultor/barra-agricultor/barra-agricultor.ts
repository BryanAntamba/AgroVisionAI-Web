import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-barra-agricultor',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './barra-agricultor.html',
  styleUrl: './barra-agricultor.css',
})
export class BarraAgricultor implements OnInit {
  historialHabilitado: boolean = true;

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Cargar configuración de historial
    const historialConfig = localStorage.getItem('agrovision_historial_habilitado');
    if (historialConfig !== null) {
      this.historialHabilitado = JSON.parse(historialConfig);
    }
  }

  cerrarSesion(): void {
    // Apagar el dispositivo al cerrar sesión
    localStorage.setItem('dispositivoConectado', 'false');
    localStorage.setItem('dispositivoDesconectado', 'true');
    
    // Navegar a login
    this.router.navigate(['/login']);
  }
}
