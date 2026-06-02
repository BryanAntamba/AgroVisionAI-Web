import { Injectable } from '@angular/core';

export interface NavbarConfig {
  tipoFondo: 'solido' | 'gradiente';
  colorBase: string;
  resplandorActivo: boolean;
  colorResplandor: string;
  posicionResplandor: string;
  opacidadResplandor: number;
  tamanoResplandor: number;
  colorBorde: string;
}

export interface ColoresConfig {
  titulos: string;
  linksNormales: string;
  linksActivos: string;
  textosDescriptivos: string;
  iconos: string;
}

export interface BotonesConfig {
  tipo: 'solido' | 'gradiente';
  colorInicial: string;
  colorFinal: string;
  colorTexto: string;
}

export interface ModalesConfig {
  colorBackdrop: string;
  opacidadBackdrop: number;
}

export interface PlataformaConfig {
  nombrePlataforma: string;
  navbar: NavbarConfig;
  colores: ColoresConfig;
  botones: BotonesConfig;
  modales: ModalesConfig;
  logoUrl?: string;
  faviconUrl?: string;
}

const STORAGE_KEY = 'agrovision_config_visual';

@Injectable({
  providedIn: 'root'
})
export class TemaService {
  private readonly defaultConfig: PlataformaConfig = {
    nombrePlataforma: 'AgroVision AI',
    navbar: {
      tipoFondo: 'gradiente',
      colorBase: '#ffffff',
      resplandorActivo: true,
      colorResplandor: '#55a820',
      posicionResplandor: 'top right',
      opacidadResplandor: 20,
      tamanoResplandor: 34,
      colorBorde: '#d7e4dc',
    },
    colores: {
      titulos: '#073d2b',
      linksNormales: '#456657',
      linksActivos: '#55a820',
      textosDescriptivos: '#597268',
      iconos: '#55a820',
    },
    botones: {
      tipo: 'gradiente',
      colorInicial: '#073d2b',
      colorFinal: '#55a820',
      colorTexto: '#ffffff',
    },
    modales: {
      colorBackdrop: '#073d2b',
      opacidadBackdrop: 45,
    }
  };

  private currentConfig: PlataformaConfig;

  constructor() {
    this.currentConfig = this.cargarConfig();
    this.aplicarTema(this.currentConfig);
  }

  getConfig(): PlataformaConfig {
    return { ...this.currentConfig };
  }

  getDefaultConfig(): PlataformaConfig {
    return JSON.parse(JSON.stringify(this.defaultConfig));
  }

  cargarConfig(): PlataformaConfig {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Mezclar con default para asegurar que no falten campos
        return {
          ...this.defaultConfig,
          ...parsed,
          navbar: { ...this.defaultConfig.navbar, ...parsed.navbar },
          colores: { ...this.defaultConfig.colores, ...parsed.colores },
          botones: { ...this.defaultConfig.botones, ...parsed.botones },
          modales: { ...this.defaultConfig.modales, ...parsed.modales }
        };
      }
    } catch (e) {
      console.error('Error al cargar la configuración visual:', e);
    }
    return JSON.parse(JSON.stringify(this.defaultConfig));
  }

  guardarConfig(config: PlataformaConfig): void {
    this.currentConfig = config;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    this.aplicarTema(config);
  }

  resetearConfig(): PlataformaConfig {
    this.guardarConfig(this.defaultConfig);
    return this.getConfig();
  }

  aplicarTema(config: PlataformaConfig): void {
    if (typeof document === 'undefined') return;

    const root = document.documentElement;

    // 1. Colores de Texto y Títulos
    root.style.setProperty('--color-titulos', config.colores.titulos);
    root.style.setProperty('--color-links-normales', config.colores.linksNormales);
    root.style.setProperty('--color-links-activos', config.colores.linksActivos);
    root.style.setProperty('--color-textos-descriptivos', config.colores.textosDescriptivos);
    root.style.setProperty('--color-iconos', config.colores.iconos);

    // 2. Botones
    root.style.setProperty('--btn-color-inicial', config.botones.colorInicial);
    root.style.setProperty('--btn-color-final', config.botones.colorFinal);
    root.style.setProperty('--btn-color-texto', config.botones.colorTexto);
    
    const btnBackground = config.botones.tipo === 'solido'
      ? config.botones.colorInicial
      : `linear-gradient(135deg, ${config.botones.colorInicial}, ${config.botones.colorFinal})`;
    root.style.setProperty('--btn-background', btnBackground);

    // 3. Modales (Backdrop)
    root.style.setProperty('--modal-color-backdrop', config.modales.colorBackdrop);
    root.style.setProperty('--modal-opacidad-backdrop', `${config.modales.opacidadBackdrop / 100}`);
    
    // Backdrop RGBA calculado
    const backdropRgba = this.hexToRgba(config.modales.colorBackdrop, config.modales.opacidadBackdrop / 100);
    root.style.setProperty('--modal-backdrop-rgba', backdropRgba);

    // 4. Navbar
    root.style.setProperty('--navbar-color-base', config.navbar.colorBase);
    root.style.setProperty('--navbar-color-borde', config.navbar.colorBorde);
    
    let navbarBg = config.navbar.colorBase;
    if (config.navbar.tipoFondo === 'gradiente' && config.navbar.resplandorActivo) {
      // Si tiene gradiente, se calcula el degradado con el resplandor
      const respRgba = this.hexToRgba(config.navbar.colorResplandor, config.navbar.opacidadResplandor / 100);
      const pos = config.navbar.posicionResplandor; // e.g. "top right"
      const size = config.navbar.tamanoResplandor; // e.g. 34
      navbarBg = `radial-gradient(circle at ${pos}, ${respRgba} 0%, ${config.navbar.colorBase} ${size}%)`;
    }
    root.style.setProperty('--navbar-background', navbarBg);

    // 5. Favicon Dinámico
    if (config.faviconUrl) {
      const link = document.querySelector("link[rel*='icon']") as HTMLLinkElement;
      if (link) {
        link.href = config.faviconUrl;
      }
    }
  }

  private hexToRgba(hex: string, alpha: number): string {
    let c = hex.substring(1);
    if (c.length === 3) {
      c = c[0] + c[0] + c[1] + c[1] + c[2] + c[2];
    }
    const r = parseInt(c.slice(0, 2), 16);
    const g = parseInt(c.slice(2, 4), 16);
    const b = parseInt(c.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
}
