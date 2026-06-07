import { Component, OnInit, AfterViewInit, PLATFORM_ID, Inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-barra-agricultor',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './barra-agricultor.html',
  styleUrl: './barra-agricultor.css',
})
export class BarraAgricultor implements OnInit, AfterViewInit {
  historialHabilitado: boolean = true;

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    // Cargar configuración de historial
    const historialConfig = localStorage.getItem('agrovision_historial_habilitado');
    if (historialConfig !== null) {
      this.historialHabilitado = JSON.parse(historialConfig);
    }
  }

  ngAfterViewInit(): void {
    // Solo ejecutar en el navegador
    if (isPlatformBrowser(this.platformId)) {
      // Esperar a que Bootstrap esté disponible
      setTimeout(() => {
        this.initializeBootstrapCollapse();
      }, 100);
    }
  }

  private initializeBootstrapCollapse(): void {
    const bootstrap = (window as any).bootstrap;
    if (bootstrap) {
      const collapseElement = document.getElementById('agricultorNavbar');
      if (collapseElement) {
        // Inicializar Bootstrap Collapse sin toggle automático
        new bootstrap.Collapse(collapseElement, {
          toggle: false
        });
      }
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
