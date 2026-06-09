// Importa el decorador Injectable de Angular para permitir que este servicio se inyecte en otros componentes
import { Injectable } from '@angular/core';

// Define la interfaz NavbarConfig que especifica la configuración visual de la barra de navegación
export interface NavbarConfig {
  // Define si el fondo de la navbar es sólido o con gradiente
  tipoFondo: 'solido' | 'gradiente';
  // Define el color base de la navbar en formato hexadecimal
  colorBase: string;
  // Booleano que indica si el resplandor/brillo está activo en la navbar
  resplandorActivo: boolean;
  // Define el color del resplandor en formato hexadecimal
  colorResplandor: string;
  // Define la posición del resplandor (ej: 'top right')
  posicionResplandor: string;
  // Define la opacidad del resplandor en porcentaje (0-100)
  opacidadResplandor: number;
  // Define el tamaño del resplandor en píxeles
  tamanoResplandor: number;
  // Define el color del borde de la navbar en formato hexadecimal
  colorBorde: string;
}

// Define la interfaz ColoresConfig que especifica los colores principales de la aplicación
export interface ColoresConfig {
  // Define el color para títulos en formato hexadecimal
  titulos: string;
  // Define el color para links normales en formato hexadecimal
  linksNormales: string;
  // Define el color para links activos en formato hexadecimal
  linksActivos: string;
  // Define el color para textos descriptivos en formato hexadecimal
  textosDescriptivos: string;
  // Define el color para iconos en formato hexadecimal
  iconos: string;
}

// Define la interfaz BotonesConfig que especifica la configuración visual de los botones
export interface BotonesConfig {
  // Define si los botones tienen un fondo sólido o con gradiente
  tipo: 'solido' | 'gradiente';
  // Define el color inicial del botón (usado en gradientes)
  colorInicial: string;
  // Define el color final del botón (usado en gradientes)
  colorFinal: string;
  // Define el color del texto dentro del botón
  colorTexto: string;
  // Define el color base de los botones destructivos (eliminar, cancelar)
  destructivoColor: string;
  // Define el color que cambia al pasar el mouse sobre botones destructivos
  destructivoHover: string;
}

// Define la interfaz ModalesConfig que especifica la configuración visual de los modales
export interface ModalesConfig {
  // Define el color de fondo semitransparente detrás del modal
  colorBackdrop: string;
  // Define la opacidad del backdrop en porcentaje (0-100)
  opacidadBackdrop: number;
  // Define el color del botón destructivo en modales de confirmación (desconectar)
  botonesFondoDestructivo: string;
  // Define el color del botón destructivo al pasar mouse
  botonesHoverDestructivo: string;
  // Define el color del ícono de éxito en modales positivos (guardar reporte)
  iconoExitoColor: string;
  // Define el color de fondo del ícono de éxito
  iconoExitoFondo: string;
}

// Define la interfaz PlataformaConfig que agrupa todas las configuraciones visuales de la plataforma
export interface PlataformaConfig {
  // Define el nombre de la plataforma que se mostrará en la interfaz
  nombrePlataforma: string;
  // Contiene la configuración de la barra de navegación
  navbar: NavbarConfig;
  // Contiene la configuración de colores generales
  colores: ColoresConfig;
  // Contiene la configuración de estilos de botones
  botones: BotonesConfig;
  // Contiene la configuración de estilos de modales
  modales: ModalesConfig;
  // URL opcional del logo de la plataforma (puede ser undefined)
  logoUrl?: string;
  // URL opcional del favicon de la plataforma (puede ser undefined)
  faviconUrl?: string;
}


// Constante que define la clave para almacenar la configuración en localStorage
const STORAGE_KEY = 'agrovision_config_visual';

// Decorador que permite que este servicio sea inyectable a lo largo de la aplicación
// providedIn: 'root' hace que sea un servicio singleton disponible globalmente
@Injectable({
  providedIn: 'root'
})
// Clase TemaService que gestiona toda la configuración visual y temas de la aplicación
export class TemaService {
  // Propiedad privada que almacena la configuración por defecto de la plataforma
  // Contiene valores predefinidos para navbar, colores, botones y modales
  private readonly defaultConfig: PlataformaConfig = {
    // Nombre de la plataforma que se mostrará al usuario
    nombrePlataforma: 'AgroVision AI',
    // Configuración de la barra de navegación
    navbar: {
      // Tipo de fondo: gradiente dinámico con resplandor
      tipoFondo: 'gradiente',
      // Color base blanco para la navbar
      colorBase: '#ffffff',
      // Activa el efecto de resplandor brillante
      resplandorActivo: true,
      // Color verde para el resplandor
      colorResplandor: '#55a820',
      // Posición del resplandor en la esquina superior derecha
      posicionResplandor: 'top right',
      // Opacidad del resplandor al 20%
      opacidadResplandor: 20,
      // Tamaño del resplandor 34 píxeles
      tamanoResplandor: 34,
      // Color del borde gris claro
      colorBorde: '#d7e4dc',
    },
    // Configuración de colores principales de la aplicación
    colores: {
      // Color verde oscuro para títulos
      titulos: '#073d2b',
      // Color gris verdoso para links normales
      linksNormales: '#456657',
      // Color verde brillante para links activos
      linksActivos: '#55a820',
      // Color gris verdoso para textos descriptivos
      textosDescriptivos: '#597268',
      // Color verde para iconos
      iconos: '#55a820',
    },
    // Configuración de estilos para botones
    botones: {
      // Tipo de fondo con gradiente
      tipo: 'gradiente',
      // Color inicial del gradiente (verde oscuro)
      colorInicial: '#073d2b',
      // Color final del gradiente (verde claro)
      colorFinal: '#55a820',
      // Color del texto blanco en los botones
      colorTexto: '#ffffff',
      // Color base rojo para botones destructivos
      destructivoColor: '#a32626',
      // Color rojo más oscuro al pasar el mouse
      destructivoHover: '#8b1f1f',
    },
    // Configuración del fondo semitransparente detrás de modales
    modales: {
      // Color del backdrop (fondo del modal) verde oscuro
      colorBackdrop: '#073d2b',
      // Opacidad del backdrop al 45%
      opacidadBackdrop: 45,
      // Color rojo para botones destructivos (desconectar dispositivo)
      botonesFondoDestructivo: '#a32626',
      // Color rojo más oscuro al pasar mouse
      botonesHoverDestructivo: '#8b1f1f',
      // Color verde del ícono de éxito (reporte guardado)
      iconoExitoColor: '#55a820',
      // Fondo claro verde para el ícono de éxito
      iconoExitoFondo: '#eaf7e5',
    }
  };

  // Propiedad privada que almacena la configuración actual de la aplicación
  private currentConfig: PlataformaConfig;

  // Constructor del servicio
  // Se ejecuta cuando se inyecta el servicio en un componente
  constructor() {
    // Carga la configuración guardada en localStorage o usa la por defecto
    this.currentConfig = this.cargarConfig();
    // Aplica la configuración cargada al DOM
    this.aplicarTema(this.currentConfig);
  }

  // Método que retorna una copia de la configuración actual
  // Se retorna una copia para evitar modificaciones accidentales del original
  getConfig(): PlataformaConfig {
    return { ...this.currentConfig };
  }

  // Método que retorna una copia profunda de la configuración por defecto
  // Se usa cuando el usuario quiere resetear la configuración
  getDefaultConfig(): PlataformaConfig {
    return JSON.parse(JSON.stringify(this.defaultConfig));
  }

  // Método que carga la configuración desde localStorage
  // Si no hay configuración guardada, retorna la configuración por defecto
  cargarConfig(): PlataformaConfig {
    try {
      // Obtiene la configuración almacenada en localStorage usando la clave definida
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        // Convierte el string JSON a un objeto
        const parsed = JSON.parse(stored);
        // Mezcla la configuración guardada con la por defecto para llenar campos faltantes
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
      // Si hay un error al procesar JSON, lo muestra en consola
      console.error('Error al cargar la configuración visual:', e);
    }
    // Retorna la configuración por defecto si no hay nada guardado
    return JSON.parse(JSON.stringify(this.defaultConfig));
  }

  // Método que guarda la configuración proporcionada
  // Actualiza la configuración actual, la persiste en localStorage y aplica los cambios
  guardarConfig(config: PlataformaConfig): void {
    // Actualiza la configuración actual en memoria
    this.currentConfig = config;
    // Guarda la configuración en localStorage en formato JSON
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    // Aplica los cambios visuales al DOM
    this.aplicarTema(config);
  }

  // Método que resetea la configuración a los valores por defecto
  // Retorna la nueva configuración después de resetear
  resetearConfig(): PlataformaConfig {
    // Guarda la configuración por defecto (reemplazando la actual)
    this.guardarConfig(this.defaultConfig);
    // Retorna una copia de la nueva configuración
    return this.getConfig();
  }

  // Método que aplica la configuración de tema al DOM del navegador
  // Modifica las variables CSS globales para actualizar el estilo de toda la aplicación
  aplicarTema(config: PlataformaConfig): void {
    // Verifica que estemos en un entorno del navegador (no en servidor)
    if (typeof document === 'undefined') return;

    // Obtiene el elemento raíz del documento HTML
    const root = document.documentElement;

    // SECCIÓN 1: Aplica los colores de texto, títulos e iconos
    // Establece la variable CSS para el color de títulos
    root.style.setProperty('--color-titulos', config.colores.titulos);
    // Establece la variable CSS para el color de links normales
    root.style.setProperty('--color-links-normales', config.colores.linksNormales);
    // Establece la variable CSS para el color de links activos
    root.style.setProperty('--color-links-activos', config.colores.linksActivos);
    // Establece la variable CSS para el color de textos descriptivos
    root.style.setProperty('--color-textos-descriptivos', config.colores.textosDescriptivos);
    // Establece la variable CSS para el color de iconos
    root.style.setProperty('--color-iconos', config.colores.iconos);

    // SECCIÓN 2: Aplica la configuración de botones
    // Establece el color inicial del botón (usado en gradientes)
    root.style.setProperty('--btn-color-inicial', config.botones.colorInicial);
    // Establece el color final del botón (usado en gradientes)
    root.style.setProperty('--btn-color-final', config.botones.colorFinal);
    // Establece el color del texto en los botones
    root.style.setProperty('--btn-color-texto', config.botones.colorTexto);
    // Establece el color de botones destructivos
    root.style.setProperty('--btn-destructivo-color', config.botones.destructivoColor);
    // Establece el color hover de botones destructivos
    root.style.setProperty('--btn-destructivo-hover', config.botones.destructivoHover);
    
    // Determina el background del botón: sólido o con gradiente
    // Si el tipo es 'solido', usa solo el color inicial
    // Si es 'gradiente', crea un gradiente lineal de 135 grados
    const btnBackground = config.botones.tipo === 'solido'
      ? config.botones.colorInicial
      : `linear-gradient(135deg, ${config.botones.colorInicial}, ${config.botones.colorFinal})`;
    // Establece la variable CSS del background del botón
    root.style.setProperty('--btn-background', btnBackground);
    
    // Convierte el color destructivo a RGBA para usar como sombra
    const destructivoShadow = this.hexToRgba(config.botones.destructivoColor, 0.24);
    // Establece la variable CSS de la sombra para botones destructivos
    root.style.setProperty('--btn-destructivo-shadow', destructivoShadow);

    // SECCIÓN 3: Aplica la configuración de modales
    // Establece el color del backdrop (fondo del modal)
    root.style.setProperty('--modal-color-backdrop', config.modales.colorBackdrop);
    // Establece la opacidad del backdrop normalizada a escala 0-1
    root.style.setProperty('--modal-opacidad-backdrop', `${config.modales.opacidadBackdrop / 100}`);
    
    // Convierte el color del backdrop a RGBA con la opacidad especificada
    const backdropRgba = this.hexToRgba(config.modales.colorBackdrop, config.modales.opacidadBackdrop / 100);
    // Establece la variable CSS del backdrop en formato RGBA
    root.style.setProperty('--modal-backdrop-rgba', backdropRgba);
    
    // Establece colores para botones destructivos en modales (desconectar dispositivo)
    root.style.setProperty('--modal-btn-destructivo-color', config.modales.botonesFondoDestructivo);
    root.style.setProperty('--modal-btn-destructivo-hover', config.modales.botonesHoverDestructivo);
    
    // Convierte el color destructivo a RGBA para usar como sombra en modales
    const btnDestructivoShadow = this.hexToRgba(config.modales.botonesFondoDestructivo, 0.24);
    root.style.setProperty('--modal-btn-destructivo-shadow', btnDestructivoShadow);
    
    // Establece colores para ícono de éxito en modales (guardar reporte)
    root.style.setProperty('--modal-icono-exito-color', config.modales.iconoExitoColor);
    root.style.setProperty('--modal-icono-exito-fondo', config.modales.iconoExitoFondo);

    // SECCIÓN 4: Aplica la configuración de la navbar
    // Establece el color base de la navbar
    root.style.setProperty('--navbar-color-base', config.navbar.colorBase);
    // Establece el color del borde de la navbar
    root.style.setProperty('--navbar-color-borde', config.navbar.colorBorde);
    
    // Determina el background de la navbar
    // Inicia con el color base
    let navbarBg = config.navbar.colorBase;
    // Si el tipo es gradiente y el resplandor está activo, crea un efecto radial
    if (config.navbar.tipoFondo === 'gradiente' && config.navbar.resplandorActivo) {
      // Convierte el color del resplandor a RGBA
      const respRgba = this.hexToRgba(config.navbar.colorResplandor, config.navbar.opacidadResplandor / 100);
      // Obtiene la posición del resplandor
      const pos = config.navbar.posicionResplandor; // e.g. "top right"
      // Obtiene el tamaño del resplandor
      const size = config.navbar.tamanoResplandor; // e.g. 34
      // Crea un gradiente radial con el resplandor y el color base
      navbarBg = `radial-gradient(circle at ${pos}, ${respRgba} 0%, ${config.navbar.colorBase} ${size}%)`;
    }
    // Establece la variable CSS del background de la navbar
    root.style.setProperty('--navbar-background', navbarBg);

    // SECCIÓN 5: Aplica el favicon dinámico si se proporciona
    // Si la configuración tiene una URL de favicon
    if (config.faviconUrl) {
      // Obtiene el elemento link que contiene el favicon
      const link = document.querySelector("link[rel*='icon']") as HTMLLinkElement;
      // Si el elemento existe, actualiza su href
      if (link) {
        link.href = config.faviconUrl;
      }
    }
  }

  // Método privado que convierte un color hexadecimal a formato RGBA
  // Recibe un código hex (ej: '#ffffff') y un valor de transparencia (0-1)
  private hexToRgba(hex: string, alpha: number): string {
    // Elimina el símbolo '#' del código hexadecimal
    let c = hex.substring(1);
    // Si el hex es abreviado (3 caracteres), expande cada carácter
    // Ej: '#fff' se convierte en '#ffffff'
    if (c.length === 3) {
      c = c[0] + c[0] + c[1] + c[1] + c[2] + c[2];
    }
    // Extrae los componentes rojo, verde y azul del código hex
    // Convierte de hexadecimal base-16 a decimal base-10
    const r = parseInt(c.slice(0, 2), 16);
    const g = parseInt(c.slice(2, 4), 16);
    const b = parseInt(c.slice(4, 6), 16);
    // Retorna el color en formato RGBA (rojo, verde, azul, transparencia)
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
}
