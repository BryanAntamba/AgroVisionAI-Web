// Importa el decorador Component y las interfaces del ciclo de vida OnInit y AfterViewInit
import { Component, OnInit, AfterViewInit, PLATFORM_ID, Inject } from '@angular/core';
// Importa Router para navegación programática y RouterLink para enlaces de rutas
import { Router, RouterLink } from '@angular/router';
// Importa CommonModule para directivas básicas e isPlatformBrowser para detectar entorno navegador
import { CommonModule, isPlatformBrowser } from '@angular/common';

// Decorador @Component que define los metadatos del componente de barra de navegación del agricultor
@Component({
  // Selector CSS para usar este componente como <app-barra-agricultor>
  selector: 'app-barra-agricultor',
  // Indica que este componente es standalone (no requiere NgModule)
  standalone: true,
  // Array de módulos y directivas que puede usar en su template
  imports: [RouterLink, CommonModule],
  // Ruta al archivo HTML del template
  templateUrl: './barra-agricultor.html',
  // Ruta al archivo CSS de estilos
  styleUrl: './barra-agricultor.css',
})
// Clase que implementa OnInit para lógica de inicialización y AfterViewInit para lógica post-renderizado
export class BarraAgricultor implements OnInit, AfterViewInit {
  // Propiedad que indica si el historial de recomendaciones está habilitado
  historialHabilitado: boolean = true;

  // Constructor que inyecta el Router y el identificador de plataforma
  constructor(
    // Servicio Router para navegación programática
    private router: Router,
    // Inyecta el ID de plataforma para detectar si se ejecuta en navegador o servidor
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  // Método del ciclo de vida que se ejecuta al inicializar el componente
  ngOnInit(): void {
    // Carga la configuración de historial desde localStorage
    const historialConfig = localStorage.getItem('agrovision_historial_habilitado');
    // Si existe configuración guardada, la parsea y asigna
    if (historialConfig !== null) {
      this.historialHabilitado = JSON.parse(historialConfig);
    }
  }

  // Método del ciclo de vida que se ejecuta después de inicializar las vistas
  ngAfterViewInit(): void {
    // Solo ejecuta el código si está en el navegador (no en servidor SSR)
    if (isPlatformBrowser(this.platformId)) {
      // Espera 100ms para asegurar que Bootstrap esté disponible en el DOM
      setTimeout(() => {
        this.initializeBootstrapCollapse();
      }, 100);
    }
  }

  // Método privado que inicializa el componente Collapse de Bootstrap
  private initializeBootstrapCollapse(): void {
    // Accede a Bootstrap desde el objeto window
    const bootstrap = (window as any).bootstrap;
    // Verifica si Bootstrap está disponible
    if (bootstrap) {
      // Obtiene el elemento del menú colapsable por su ID
      const collapseElement = document.getElementById('agricultorNavbar');
      // Si el elemento existe
      if (collapseElement) {
        // Inicializa Bootstrap Collapse sin toggle automático (evita que se abra al cargar)
        new bootstrap.Collapse(collapseElement, {
          toggle: false
        });
      }
    }
  }

  // Método que maneja el cierre de sesión del agricultor
  cerrarSesion(): void {
    // Marca el dispositivo IoT como desconectado en localStorage
    localStorage.setItem('dispositivoConectado', 'false');
    // Marca que el dispositivo fue desconectado intencionalmente
    localStorage.setItem('dispositivoDesconectado', 'true');
    
    // Navega a la página de login
    this.router.navigate(['/login']);
  }
}
