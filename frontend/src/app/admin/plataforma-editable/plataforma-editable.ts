// Importa el módulo común de Angular con directivas básicas
import { CommonModule } from '@angular/common';
// Importa el decorador Component y la interfaz OnInit para el ciclo de vida
import { Component, OnInit } from '@angular/core';
// Importa clases y decoradores necesarios para formularios reactivos y validaciones
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule, FormControl } from '@angular/forms';
// Importa el componente de barra de navegación del administrador
import { BarraAdmin } from '../../navbars/barra-admin/barra-admin';
// Importa las validaciones personalizadas para el formulario de edición de plataforma
import { EdicionPlataformaValidaciones } from '../../shared/validators/panel-admin/valdiacion-edicionPlataforma/edicionPlataforma-validaciones';
// Importa el servicio de tema y sus interfaces de configuración (navbar, colores, botones, modales)
import { TemaService, NavbarConfig, ColoresConfig, BotonesConfig, ModalesConfig } from '../../shared/services/tema.service';


// Interfaz que define la estructura de una imagen en el carrusel del login
interface ImagenCarrusel {
  // Identificador único de la imagen
  id: number;
  // URL o data URL de la imagen para mostrarla
  url: string;
  // Nombre del archivo de la imagen
  nombre: string;
  // Archivo File opcional (presente cuando es una imagen nueva cargada por el usuario)
  file?: File;
  // Bandera que indica si es una imagen recién agregada (no existente previamente)
  esNueva?: boolean;
}

// Decorador @Component que define los metadatos del componente
@Component({
  // Selector CSS para usar como <app-plataforma-editable>
  selector: 'app-plataforma-editable',
  // Indica que es un componente standalone (no requiere NgModule)
  standalone: true,
  // Array de módulos y componentes que puede usar en su template
  imports: [CommonModule, ReactiveFormsModule, FormsModule, BarraAdmin],
  // Ruta al archivo HTML del template
  templateUrl: './plataforma-editable.html',
  // Ruta al archivo CSS de estilos
  styleUrl: './plataforma-editable.css',
})
// Clase que implementa OnInit para ejecutar lógica al inicializar
export class PlataformaEditable implements OnInit {
  // ===== FORMULARIO REACTIVO =====
  // Objeto FormGroup que contiene los controles del formulario
  form: FormGroup;
  // Referencia al objeto de validaciones personalizado
  validaciones = EdicionPlataformaValidaciones;

  // ===== MODALES DE CONFIRMACIÓN Y ÉXITO =====
  // Bandera para controlar la visibilidad del modal de confirmación de reseteo
  mostrarModalResetConfirmar: boolean = false;
  // Bandera para controlar la visibilidad del modal de éxito de reseteo
  mostrarModalResetExito: boolean = false;
  // Bandera para controlar la visibilidad del modal de éxito al guardar cambios
  mostrarModalGuardadoExito: boolean = false;
  // Bandera para controlar la visibilidad del modal de errores de validación
  mostrarModalErrores: boolean = false;
  // Array que almacena los mensajes de error de validación para mostrar
  erroresValidacion: string[] = [];

  // ===== LOGO Y FAVICON =====
  // URL de vista previa del logo (data URL o null si no hay logo)
  logoPreview: string | null = null;
  // URL de vista previa del favicon (data URL o null si no hay favicon)
  faviconPreview: string | null = null;
  // Archivo File del logo seleccionado por el usuario
  logoFile: File | null = null;
  // Archivo File del favicon seleccionado por el usuario
  faviconFile: File | null = null;

  // ===== NOMBRE DE LA PLATAFORMA =====
  // Nombre de la plataforma que se muestra en el sistema
  nombrePlataforma: string = 'AgroVision AI';

  // ===== IMÁGENES DEL CARRUSEL =====
  // Array de imágenes que se muestran en el carrusel del login
  imagenesCarrusel: ImagenCarrusel[] = [
    { id: 1, url: 'assets/imagesLogin/sosteniendoTomate.jpg', nombre: 'sosteniendoTomate.jpg' },
    { id: 2, url: 'assets/imagesLogin/tomateHumedo.jpg', nombre: 'tomateHumedo.jpg' },
    { id: 3, url: 'assets/imagesLogin/tomateIluminado.jpg', nombre: 'tomateIluminado.jpg' },
  ];
  // Contador para generar IDs únicos para nuevas imágenes del carrusel
  siguienteIdCarrusel: number = 4;

  // ===== CONFIGURACIÓN DEL NAVBAR =====
  // Objeto que almacena toda la configuración visual del navbar
  navbar: NavbarConfig = {
    // Tipo de fondo del navbar ('solido' o 'gradiente')
    tipoFondo: 'gradiente',
    // Color base del navbar (usado en fondo sólido o como color inicial del gradiente)
    colorBase: '#ffffff',
    // Indica si el efecto de resplandor está activo
    resplandorActivo: true,
    // Color del efecto de resplandor
    colorResplandor: '#55a820',
    // Posición del resplandor ('top left', 'top right', etc.)
    posicionResplandor: 'top right',
    // Opacidad del resplandor (0-100)
    opacidadResplandor: 20,
    // Tamaño del resplandor en porcentaje
    tamanoResplandor: 34,
    // Color del borde inferior del navbar
    colorBorde: '#d7e4dc',
  };

  // ===== CONFIGURACIÓN DE COLORES =====
  // Objeto que almacena los colores principales del sistema
  colores: ColoresConfig = {
    // Color de los títulos principales
    titulos: '#073d2b',
    // Color de los enlaces en estado normal
    linksNormales: '#456657',
    // Color de los enlaces en estado activo/hover
    linksActivos: '#55a820',
    // Color de textos descriptivos o secundarios
    textosDescriptivos: '#597268',
    // Color de los íconos
    iconos: '#55a820',
  };

  // ===== CONFIGURACIÓN DE BOTONES =====
  // Objeto que almacena la configuración visual de los botones
  botones: BotonesConfig = {
    // Tipo de botón ('solido' o 'gradiente')
    tipo: 'gradiente',
    // Color inicial (usado en sólido o como inicio del gradiente)
    colorInicial: '#073d2b',
    // Color final del gradiente
    colorFinal: '#55a820',
    // Color del texto del botón
    colorTexto: '#ffffff',
    // Color de fondo para botones destructivos (eliminar, cancelar)
    destructivoColor: '#a32626',
    // Color de hover para botones destructivos
    destructivoHover: '#8b1f1f',
  };

  // ===== CONFIGURACIÓN DE MODALES =====
  // Objeto que almacena la configuración visual de los modales
  modales: ModalesConfig = {
    // Color del backdrop (fondo oscuro detrás del modal)
    colorBackdrop: '#073d2b',
    // Opacidad del backdrop (0-100)
    opacidadBackdrop: 45,
    // Color del botón destructivo (Desconectar dispositivo)
    botonesFondoDestructivo: '#a32626',
    // Color hover del botón destructivo
    botonesHoverDestructivo: '#8b1f1f',
    // Color del ícono de éxito (check verde)
    iconoExitoColor: '#55a820',
    // Color de fondo del ícono de éxito
    iconoExitoFondo: '#eaf7e5',
  };

  // ===== CONFIGURACIÓN DE HISTORIAL =====
  // Bandera que indica si el historial de cambios está habilitado
  historialHabilitado: boolean = true;

  // Constructor del componente que inyecta dependencias y carga configuración inicial
  constructor(private fb: FormBuilder, private temaService: TemaService) {
    // Carga la configuración actual del tema desde el servicio centralizado
    const config = this.temaService.getConfig();
    // Asigna el nombre de la plataforma desde la configuración
    this.nombrePlataforma = config.nombrePlataforma;
    // Asigna la configuración del navbar
    this.navbar = config.navbar;
    // Asigna la configuración de colores
    this.colores = config.colores;
    // Asigna la configuración de botones
    this.botones = config.botones;
    // Asigna la configuración de modales
    this.modales = config.modales;
    
    // Carga la configuración de historial desde localStorage
    const historialConfig = localStorage.getItem('agrovision_historial_habilitado');
    // Si existe configuración guardada, la parsea y asigna
    if (historialConfig !== null) {
      this.historialHabilitado = JSON.parse(historialConfig);
    }

    // Inicializa el formulario reactivo con validaciones
    this.form = this.fb.group({
      // Campo nombrePlataforma con validaciones requeridas, longitud mínima/máxima y patrón
      nombrePlataforma: [
        // Valor inicial del campo
        this.nombrePlataforma,
        [
          // El campo es requerido
          Validators.required,
          // Longitud mínima de 3 caracteres
          Validators.minLength(3),
          // Longitud máxima de 50 caracteres
          Validators.maxLength(50),
          // Patrón personalizado para validar el formato del nombre
          Validators.pattern(EdicionPlataformaValidaciones.NOMBRE_PLATAFORMA_PATTERN)
        ]
      ]
    });

    // Sincroniza cambios del formulario con la propiedad nombrePlataforma
    this.form.get('nombrePlataforma')?.valueChanges.subscribe(value => {
      // Actualiza la propiedad nombrePlataforma cada vez que cambia el valor del campo
      this.nombrePlataforma = value;
    });

    // Agrega controles para los modales editables
    this.form.addControl('botonesFondoDestructivo', new FormControl(this.modales.botonesFondoDestructivo));
    this.form.addControl('botonesHoverDestructivo', new FormControl(this.modales.botonesHoverDestructivo));
    this.form.addControl('iconoExitoColor', new FormControl(this.modales.iconoExitoColor));
    this.form.addControl('iconoExitoFondo', new FormControl(this.modales.iconoExitoFondo));
  }

  // Método del ciclo de vida que se ejecuta una vez al inicializar el componente
  ngOnInit(): void {
    // Aplica el tema actual para sincronizar la visualización con la configuración guardada
    this.temaService.aplicarTema(this.temaService.getConfig());
  }

  // Getter que proporciona acceso rápido a los controles del formulario
  get f() {
    // Retorna el objeto controls del formulario para acceder a los campos
    return this.form.controls;
  }

  // ========== MANEJO DE LOGO ==========
  // Método que maneja el evento de cambio cuando el usuario selecciona un archivo de logo
  onLogoChange(event: Event): void {
    // Cast del event target a HTMLInputElement para acceder a los archivos
    const input = event.target as HTMLInputElement;
    // Verifica si hay archivos seleccionados
    if (input.files && input.files[0]) {
      // Obtiene el primer archivo seleccionado
      const file = input.files[0];
      
      // Valida que el tipo de archivo sea una imagen válida (PNG, JPG o SVG)
      if (!file.type.match(/image\/(png|jpeg|jpg|svg\+xml)/)) {
        // Muestra alerta si el formato no es válido
        alert('Por favor, seleccione una imagen válida (PNG, JPG o SVG)');
        return;
      }

      // Valida que el tamaño del archivo no supere los 2MB
      if (file.size > 2 * 1024 * 1024) {
        // Muestra alerta si el tamaño es excesivo
        alert('La imagen no debe superar los 2MB');
        return;
      }

      // Almacena el archivo seleccionado
      this.logoFile = file;
      // Crea un FileReader para convertir el archivo a data URL
      const reader = new FileReader();
      // Define el callback que se ejecuta cuando la lectura está completa
      reader.onload = (e: ProgressEvent<FileReader>) => {
        // Almacena el data URL para mostrar la vista previa
        this.logoPreview = e.target?.result as string;
      };
      // Inicia la lectura del archivo como data URL
      reader.readAsDataURL(file);
    }
  }

  // Método que elimina el logo seleccionado
  removerLogo(): void {
    // Limpia la vista previa del logo
    this.logoPreview = null;
    // Limpia el archivo del logo
    this.logoFile = null;
  }

  // Método que cancela la selección del logo
  cancelarLogo(): void {
    // Llama al método removerLogo para limpiar la selección
    this.removerLogo();
  }

  // ========== MANEJO DE FAVICON ==========
  // Método que maneja el evento de cambio cuando el usuario selecciona un archivo de favicon
  onFaviconChange(event: Event): void {
    // Cast del event target a HTMLInputElement para acceder a los archivos
    const input = event.target as HTMLInputElement;
    // Verifica si hay archivos seleccionados
    if (input.files && input.files[0]) {
      // Obtiene el primer archivo seleccionado
      const file = input.files[0];
      
      // Valida que el tipo de archivo sea un ícono válido (PNG, ICO o SVG)
      if (!file.type.match(/image\/(png|x-icon|svg\+xml)/)) {
        // Muestra alerta si el formato no es válido
        alert('Por favor, seleccione un icono válido (PNG, ICO o SVG)');
        return;
      }

      // Valida que el tamaño del archivo no supere los 500KB
      if (file.size > 500 * 1024) {
        // Muestra alerta si el tamaño es excesivo
        alert('El icono no debe superar los 500KB');
        return;
      }

      // Almacena el archivo seleccionado
      this.faviconFile = file;
      // Crea un FileReader para convertir el archivo a data URL
      const reader = new FileReader();
      // Define el callback que se ejecuta cuando la lectura está completa
      reader.onload = (e: ProgressEvent<FileReader>) => {
        // Almacena el data URL para mostrar la vista previa
        this.faviconPreview = e.target?.result as string;
      };
      // Inicia la lectura del archivo como data URL
      reader.readAsDataURL(file);
    }
  }

  // Método que elimina el favicon seleccionado
  removerFavicon(): void {
    // Limpia la vista previa del favicon
    this.faviconPreview = null;
    // Limpia el archivo del favicon
    this.faviconFile = null;
  }

  // Método que cancela la selección del favicon
  cancelarFavicon(): void {
    // Llama al método removerFavicon para limpiar la selección
    this.removerFavicon();
  }

  // ========== MANEJO DE CARRUSEL ==========
  // Método que agrega una o más imágenes nuevas al carrusel
  agregarImagenCarrusel(event: Event): void {
    // Cast del event target a HTMLInputElement para acceder a los archivos
    const input = event.target as HTMLInputElement;
    // Verifica si hay archivos seleccionados
    if (input.files && input.files.length > 0) {
      // Itera sobre todos los archivos seleccionados
      Array.from(input.files).forEach((file) => {
        // Valida que el tipo de archivo sea una imagen válida (PNG o JPG)
        if (!file.type.match(/image\/(png|jpeg|jpg)/)) {
          // Muestra alerta con el nombre del archivo si el formato no es válido
          alert(`${file.name}: Por favor, seleccione una imagen válida (PNG o JPG)`);
          return;
        }

        // Valida que el tamaño del archivo no supere los 5MB
        if (file.size > 5 * 1024 * 1024) {
          // Muestra alerta con el nombre del archivo si el tamaño es excesivo
          alert(`${file.name}: La imagen no debe superar los 5MB`);
          return;
        }

        // Crea un FileReader para convertir el archivo a data URL
        const reader = new FileReader();
        // Define el callback que se ejecuta cuando la lectura está completa
        reader.onload = (e: ProgressEvent<FileReader>) => {
          // Agrega la nueva imagen al array del carrusel
          this.imagenesCarrusel.push({
            // Asigna un ID único incremental
            id: this.siguienteIdCarrusel++,
            // Almacena el data URL para mostrar la vista previa
            url: e.target?.result as string,
            // Almacena el nombre del archivo
            nombre: file.name,
            // Almacena la referencia al archivo original
            file: file,
            // Marca la imagen como nueva
            esNueva: true,
          });
        };
        // Inicia la lectura del archivo como data URL
        reader.readAsDataURL(file);
      });

      // Limpia el valor del input para permitir seleccionar el mismo archivo nuevamente
      input.value = '';
    }
  }

  // Método que elimina una imagen específica del carrusel
  removerImagenCarrusel(id: number): void {
    // Verifica si hay solo una imagen en el carrusel (mínimo requerido)
    if (this.imagenesCarrusel.length <= 1) {
      // Muestra alerta indicando que debe mantener al menos una imagen
      alert('Debe mantener al menos una imagen en el carrusel');
      return;
    }

    // Solicita confirmación al usuario antes de eliminar
    const confirmar = confirm('¿Está seguro de que desea eliminar esta imagen del carrusel?');
    // Si el usuario confirma la eliminación
    if (confirmar) {
      // Filtra el array manteniendo todas las imágenes excepto la que tiene el ID especificado
      this.imagenesCarrusel = this.imagenesCarrusel.filter((img) => img.id !== id);
    }
  }

  // Método que mueve una imagen hacia arriba en el orden del carrusel
  moverImagenArriba(index: number): void {
    // Verifica que la imagen no esté ya en la primera posición
    if (index > 0) {
      // Almacena temporalmente la imagen actual
      const temp = this.imagenesCarrusel[index];
      // Mueve la imagen anterior a la posición actual
      this.imagenesCarrusel[index] = this.imagenesCarrusel[index - 1];
      // Coloca la imagen actual en la posición anterior
      this.imagenesCarrusel[index - 1] = temp;
    }
  }

  // Método que mueve una imagen hacia abajo en el orden del carrusel
  moverImagenAbajo(index: number): void {
    // Verifica que la imagen no esté ya en la última posición
    if (index < this.imagenesCarrusel.length - 1) {
      // Almacena temporalmente la imagen actual
      const temp = this.imagenesCarrusel[index];
      // Mueve la imagen siguiente a la posición actual
      this.imagenesCarrusel[index] = this.imagenesCarrusel[index + 1];
      // Coloca la imagen actual en la posición siguiente
      this.imagenesCarrusel[index + 1] = temp;
    }
  }

  // Método que permite cambiar/reemplazar una imagen específica del carrusel
  cambiarImagenCarrusel(event: Event, id: number): void {
    // Cast del event target a HTMLInputElement para acceder a los archivos
    const input = event.target as HTMLInputElement;
    // Verifica si hay un archivo seleccionado
    if (input.files && input.files[0]) {
      // Obtiene el primer archivo seleccionado
      const file = input.files[0];

      // Valida que el tipo de archivo sea una imagen válida (PNG o JPG)
      if (!file.type.match(/image\/(png|jpeg|jpg)/)) {
        // Muestra alerta si el formato no es válido
        alert('Por favor, seleccione una imagen válida (PNG o JPG)');
        return;
      }

      // Valida que el tamaño del archivo no supere los 5MB
      if (file.size > 5 * 1024 * 1024) {
        // Muestra alerta si el tamaño es excesivo
        alert('La imagen no debe superar los 5MB');
        return;
      }

      // Crea un FileReader para convertir el archivo a data URL
      const reader = new FileReader();
      // Define el callback que se ejecuta cuando la lectura está completa
      reader.onload = (e: ProgressEvent<FileReader>) => {
        // Busca la imagen en el array por su ID
        const imagen = this.imagenesCarrusel.find((img) => img.id === id);
        // Si encuentra la imagen
        if (imagen) {
          // Actualiza la URL con el nuevo data URL
          imagen.url = e.target?.result as string;
          // Actualiza el nombre del archivo
          imagen.nombre = file.name;
          // Almacena la referencia al nuevo archivo
          imagen.file = file;
          // Marca la imagen como nueva/modificada
          imagen.esNueva = true;
        }
      };
      // Inicia la lectura del archivo como data URL
      reader.readAsDataURL(file);

      // Limpia el valor del input para permitir seleccionar el mismo archivo nuevamente
      input.value = '';
    }
  }

  // ========== VISTA PREVIA DE BOTÓN ==========
  // Método que genera el estilo de fondo para la vista previa del botón
  getBtnPreviewBackground(): string {
    // Si el tipo de botón es sólido, retorna solo el color inicial
    if (this.botones.tipo === 'solido') {
      return this.botones.colorInicial;
    }
    // Si es gradiente, retorna un gradiente CSS con los colores inicial y final
    return `linear-gradient(135deg, ${this.botones.colorInicial}, ${this.botones.colorFinal})`;
  }

  // ========== GUARDAR CAMBIOS ==========
  // Método que guarda todos los cambios realizados en la configuración
  guardarCambios(): void {
    // Marca todos los campos del formulario como tocados para mostrar validaciones
    this.form.markAllAsTouched();

    // Valida el formulario completo usando las validaciones personalizadas
    const validacion = EdicionPlataformaValidaciones.validarFormularioCompleto(
      this.nombrePlataforma,
      this.logoFile,
      this.faviconFile,
      this.imagenesCarrusel
    );

    // Si la validación falla
    if (!validacion.valido) {
      // Almacena los errores de validación
      this.erroresValidacion = validacion.errores;
      // Muestra el modal de errores
      this.mostrarModalErrores = true;
      return;
    }

    // Guarda la configuración en el servicio TemaService para aplicarla globalmente
    this.temaService.guardarConfig({
      // Guarda el nombre de la plataforma
      nombrePlataforma: this.nombrePlataforma,
      // Guarda la configuración del navbar
      navbar: this.navbar,
      // Guarda la configuración de colores
      colores: this.colores,
      // Guarda la configuración de botones
      botones: this.botones,
      // Guarda la configuración de modales
      modales: this.modales,
      // Guarda la URL del favicon si existe
      faviconUrl: this.faviconPreview || undefined
    });

    // Guarda la configuración de historial en localStorage
    localStorage.setItem('agrovision_historial_habilitado', JSON.stringify(this.historialHabilitado));

    // Muestra el modal de éxito
    this.mostrarModalGuardadoExito = true;
  }

  // Método que cierra el modal de éxito de guardado
  cerrarModalGuardadoExito(): void {
    // Desactiva la bandera del modal de éxito
    this.mostrarModalGuardadoExito = false;
  }

  // Método que cierra el modal de errores de validación
  cerrarModalErrores(): void {
    // Desactiva la bandera del modal de errores
    this.mostrarModalErrores = false;
  }

  // ========== RESETEAR CAMBIOS ==========
  // Método que abre el modal de confirmación para resetear todos los cambios
  abrirResetearCambios(): void {
    // Activa la bandera para mostrar el modal de confirmación
    this.mostrarModalResetConfirmar = true;
  }

  // Método que cierra el modal de confirmación de reseteo sin aplicar cambios
  cerrarModalResetConfirmar(): void {
    // Desactiva la bandera del modal de confirmación
    this.mostrarModalResetConfirmar = false;
  }

  // Método que confirma y ejecuta el reseteo de toda la configuración
  confirmarResetear(): void {
    // Cierra el modal de confirmación
    this.mostrarModalResetConfirmar = false;

    // Resetea la configuración visual en el servicio y obtiene los valores por defecto
    const configDefault = this.temaService.resetearConfig();

    // Restaura los campos locales a sus valores por defecto
    // Limpia la vista previa del logo
    this.logoPreview = null;
    // Limpia la vista previa del favicon
    this.faviconPreview = null;
    // Limpia el archivo del logo
    this.logoFile = null;
    // Limpia el archivo del favicon
    this.faviconFile = null;
    // Restaura el nombre de la plataforma por defecto
    this.nombrePlataforma = configDefault.nombrePlataforma;
    // Actualiza el valor del campo del formulario
    this.form.patchValue({ nombrePlataforma: configDefault.nombrePlataforma });

    // Restaura las imágenes por defecto del carrusel
    this.imagenesCarrusel = [
      { id: 1, url: 'assets/imagesLogin/sosteniendoTomate.jpg', nombre: 'sosteniendoTomate.jpg' },
      { id: 2, url: 'assets/imagesLogin/tomateHumedo.jpg', nombre: 'tomateHumedo.jpg' },
      { id: 3, url: 'assets/imagesLogin/tomateIluminado.jpg', nombre: 'tomateIluminado.jpg' },
    ];
    // Reinicia el contador de IDs del carrusel
    this.siguienteIdCarrusel = 4;

    // Restaura la configuración por defecto del navbar
    this.navbar = configDefault.navbar;
    // Restaura la configuración por defecto de colores
    this.colores = configDefault.colores;
    // Restaura la configuración por defecto de botones
    this.botones = configDefault.botones;
    // Restaura la configuración por defecto de modales
    this.modales = configDefault.modales;
    
    // Resetea la configuración de historial a habilitado
    this.historialHabilitado = true;
    // Guarda el estado de historial por defecto en localStorage
    localStorage.setItem('agrovision_historial_habilitado', JSON.stringify(true));

    // Muestra el modal de éxito de reseteo
    this.mostrarModalResetExito = true;
  }

  // Método que cierra el modal de éxito de reseteo
  cerrarModalResetExito(): void {
    // Desactiva la bandera del modal de éxito de reseteo
    this.mostrarModalResetExito = false;
  }

  // ========== VISTA PREVIA DE BACKDROP ==========
  // Método que genera el color RGBA del backdrop del modal para vista previa
  getBackdropPreview(): string {
    // Extrae el componente rojo del color hexadecimal (caracteres 1-2)
    const r = parseInt(this.modales.colorBackdrop.slice(1, 3), 16);
    // Extrae el componente verde del color hexadecimal (caracteres 3-4)
    const g = parseInt(this.modales.colorBackdrop.slice(3, 5), 16);
    // Extrae el componente azul del color hexadecimal (caracteres 5-6)
    const b = parseInt(this.modales.colorBackdrop.slice(5, 7), 16);
    // Convierte la opacidad de 0-100 a 0-1 para el formato RGBA
    const opacity = this.modales.opacidadBackdrop / 100;
    // Retorna el color en formato RGBA para usar en CSS
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }
}

