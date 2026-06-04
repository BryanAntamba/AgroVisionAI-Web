import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { BarraAdmin } from '../../../navbars/barra-admin/barra-admin';
import { EdicionPlataformaValidaciones } from '../../../shared/validators/panel-admin/valdiacion-edicionPlataforma/edicionPlataforma-validaciones';
import { TemaService, NavbarConfig, ColoresConfig, BotonesConfig, ModalesConfig } from '../../../shared/services/tema.service';

interface ImagenCarrusel {
  id: number;
  url: string;
  nombre: string;
  file?: File;
  esNueva?: boolean;
}

@Component({
  selector: 'app-plataforma-editable',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, BarraAdmin],
  templateUrl: './plataforma-editable.html',
  styleUrl: './plataforma-editable.css',
})
export class PlataformaEditable implements OnInit {
  // Formulario reactivo
  form: FormGroup;
  validaciones = EdicionPlataformaValidaciones;

  // Modales de confirmación y éxito
  mostrarModalResetConfirmar: boolean = false;
  mostrarModalResetExito: boolean = false;
  mostrarModalGuardadoExito: boolean = false;
  mostrarModalErrores: boolean = false;
  erroresValidacion: string[] = [];

  // Logo y Favicon
  logoPreview: string | null = null;
  faviconPreview: string | null = null;
  logoFile: File | null = null;
  faviconFile: File | null = null;

  // Nombre de la plataforma
  nombrePlataforma: string = 'AgroVision AI';

  // Imágenes del Carrusel
  imagenesCarrusel: ImagenCarrusel[] = [
    { id: 1, url: 'assets/imagesLogin/sosteniendoTomate.jpg', nombre: 'sosteniendoTomate.jpg' },
    { id: 2, url: 'assets/imagesLogin/tomateHumedo.jpg', nombre: 'tomateHumedo.jpg' },
    { id: 3, url: 'assets/imagesLogin/tomateIluminado.jpg', nombre: 'tomateIluminado.jpg' },
  ];
  siguienteIdCarrusel: number = 4;

  // Configuración del Navbar
  navbar: NavbarConfig = {
    tipoFondo: 'gradiente',
    colorBase: '#ffffff',
    resplandorActivo: true,
    colorResplandor: '#55a820',
    posicionResplandor: 'top right',
    opacidadResplandor: 20,
    tamanoResplandor: 34,
    colorBorde: '#d7e4dc',
  };

  // Configuración de Colores
  colores: ColoresConfig = {
    titulos: '#073d2b',
    linksNormales: '#456657',
    linksActivos: '#55a820',
    textosDescriptivos: '#597268',
    iconos: '#55a820',
  };

  // Configuración de Botones
  botones: BotonesConfig = {
    tipo: 'gradiente',
    colorInicial: '#073d2b',
    colorFinal: '#55a820',
    colorTexto: '#ffffff',
  };

  // Configuración de Modales
  modales: ModalesConfig = {
    colorBackdrop: '#073d2b',
    opacidadBackdrop: 45,
  };

  // Configuración de Historial
  historialHabilitado: boolean = true;

  constructor(private fb: FormBuilder, private temaService: TemaService) {
    // Cargar la configuración actual desde el servicio
    const config = this.temaService.getConfig();
    this.nombrePlataforma = config.nombrePlataforma;
    this.navbar = config.navbar;
    this.colores = config.colores;
    this.botones = config.botones;
    this.modales = config.modales;
    
    // Cargar configuración de historial desde localStorage
    const historialConfig = localStorage.getItem('agrovision_historial_habilitado');
    if (historialConfig !== null) {
      this.historialHabilitado = JSON.parse(historialConfig);
    }

    // Inicializar formulario con validaciones
    this.form = this.fb.group({
      nombrePlataforma: [
        this.nombrePlataforma,
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
          Validators.pattern(EdicionPlataformaValidaciones.NOMBRE_PLATAFORMA_PATTERN)
        ]
      ]
    });

    // Sincronizar con la propiedad nombrePlataforma
    this.form.get('nombrePlataforma')?.valueChanges.subscribe(value => {
      this.nombrePlataforma = value;
    });
  }

  ngOnInit(): void {
    // Aplicar el tema al renderizar para sincronizar
    this.temaService.aplicarTema(this.temaService.getConfig());
  }

  get f() {
    return this.form.controls;
  }

  // ========== MANEJO DE LOGO ==========
  onLogoChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      
      // Validar tipo de archivo
      if (!file.type.match(/image\/(png|jpeg|jpg|svg\+xml)/)) {
        alert('Por favor, seleccione una imagen válida (PNG, JPG o SVG)');
        return;
      }

      // Validar tamaño (máximo 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert('La imagen no debe superar los 2MB');
        return;
      }

      this.logoFile = file;
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        this.logoPreview = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  removerLogo(): void {
    this.logoPreview = null;
    this.logoFile = null;
  }

  cancelarLogo(): void {
    this.removerLogo();
  }

  // ========== MANEJO DE FAVICON ==========
  onFaviconChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      
      // Validar tipo de archivo
      if (!file.type.match(/image\/(png|x-icon|svg\+xml)/)) {
        alert('Por favor, seleccione un icono válido (PNG, ICO o SVG)');
        return;
      }

      // Validar tamaño (máximo 500KB)
      if (file.size > 500 * 1024) {
        alert('El icono no debe superar los 500KB');
        return;
      }

      this.faviconFile = file;
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        this.faviconPreview = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  removerFavicon(): void {
    this.faviconPreview = null;
    this.faviconFile = null;
  }

  cancelarFavicon(): void {
    this.removerFavicon();
  }

  // ========== MANEJO DE CARRUSEL ==========
  agregarImagenCarrusel(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      Array.from(input.files).forEach((file) => {
        // Validar tipo de archivo
        if (!file.type.match(/image\/(png|jpeg|jpg)/)) {
          alert(`${file.name}: Por favor, seleccione una imagen válida (PNG o JPG)`);
          return;
        }

        // Validar tamaño (máximo 5MB)
        if (file.size > 5 * 1024 * 1024) {
          alert(`${file.name}: La imagen no debe superar los 5MB`);
          return;
        }

        // Crear preview
        const reader = new FileReader();
        reader.onload = (e: ProgressEvent<FileReader>) => {
          this.imagenesCarrusel.push({
            id: this.siguienteIdCarrusel++,
            url: e.target?.result as string,
            nombre: file.name,
            file: file,
            esNueva: true,
          });
        };
        reader.readAsDataURL(file);
      });

      // Limpiar input
      input.value = '';
    }
  }

  removerImagenCarrusel(id: number): void {
    if (this.imagenesCarrusel.length <= 1) {
      alert('Debe mantener al menos una imagen en el carrusel');
      return;
    }

    const confirmar = confirm('¿Está seguro de que desea eliminar esta imagen del carrusel?');
    if (confirmar) {
      this.imagenesCarrusel = this.imagenesCarrusel.filter((img) => img.id !== id);
    }
  }

  moverImagenArriba(index: number): void {
    if (index > 0) {
      const temp = this.imagenesCarrusel[index];
      this.imagenesCarrusel[index] = this.imagenesCarrusel[index - 1];
      this.imagenesCarrusel[index - 1] = temp;
    }
  }

  moverImagenAbajo(index: number): void {
    if (index < this.imagenesCarrusel.length - 1) {
      const temp = this.imagenesCarrusel[index];
      this.imagenesCarrusel[index] = this.imagenesCarrusel[index + 1];
      this.imagenesCarrusel[index + 1] = temp;
    }
  }

  cambiarImagenCarrusel(event: Event, id: number): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];

      // Validar tipo de archivo
      if (!file.type.match(/image\/(png|jpeg|jpg)/)) {
        alert('Por favor, seleccione una imagen válida (PNG o JPG)');
        return;
      }

      // Validar tamaño (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('La imagen no debe superar los 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        const imagen = this.imagenesCarrusel.find((img) => img.id === id);
        if (imagen) {
          imagen.url = e.target?.result as string;
          imagen.nombre = file.name;
          imagen.file = file;
          imagen.esNueva = true;
        }
      };
      reader.readAsDataURL(file);

      // Limpiar input
      input.value = '';
    }
  }

  // ========== VISTA PREVIA DE BOTÓN ==========
  getBtnPreviewBackground(): string {
    if (this.botones.tipo === 'solido') {
      return this.botones.colorInicial;
    }
    return `linear-gradient(135deg, ${this.botones.colorInicial}, ${this.botones.colorFinal})`;
  }

  // ========== GUARDAR CAMBIOS ==========
  guardarCambios(): void {
    // Marcar todos los campos como tocados para mostrar validaciones
    this.form.markAllAsTouched();

    // Validar formulario completo
    const validacion = EdicionPlataformaValidaciones.validarFormularioCompleto(
      this.nombrePlataforma,
      this.logoFile,
      this.faviconFile,
      this.imagenesCarrusel
    );

    if (!validacion.valido) {
      this.erroresValidacion = validacion.errores;
      this.mostrarModalErrores = true;
      return;
    }

    // Guardar en el servicio TemaService para actualizar globalmente
    this.temaService.guardarConfig({
      nombrePlataforma: this.nombrePlataforma,
      navbar: this.navbar,
      colores: this.colores,
      botones: this.botones,
      modales: this.modales,
      faviconUrl: this.faviconPreview || undefined
    });

    // Guardar configuración de historial
    localStorage.setItem('agrovision_historial_habilitado', JSON.stringify(this.historialHabilitado));

    this.mostrarModalGuardadoExito = true;
  }

  cerrarModalGuardadoExito(): void {
    this.mostrarModalGuardadoExito = false;
  }

  cerrarModalErrores(): void {
    this.mostrarModalErrores = false;
  }

  // ========== RESETEAR CAMBIOS ==========
  abrirResetearCambios(): void {
    this.mostrarModalResetConfirmar = true;
  }

  cerrarModalResetConfirmar(): void {
    this.mostrarModalResetConfirmar = false;
  }

  confirmarResetear(): void {
    this.mostrarModalResetConfirmar = false;

    // Resetear configuración visual en el servicio
    const configDefault = this.temaService.resetearConfig();

    // Restaurar campos locales
    this.logoPreview = null;
    this.faviconPreview = null;
    this.logoFile = null;
    this.faviconFile = null;
    this.nombrePlataforma = configDefault.nombrePlataforma;
    this.form.patchValue({ nombrePlataforma: configDefault.nombrePlataforma });

    this.imagenesCarrusel = [
      { id: 1, url: 'assets/imagesLogin/sosteniendoTomate.jpg', nombre: 'sosteniendoTomate.jpg' },
      { id: 2, url: 'assets/imagesLogin/tomateHumedo.jpg', nombre: 'tomateHumedo.jpg' },
      { id: 3, url: 'assets/imagesLogin/tomateIluminado.jpg', nombre: 'tomateIluminado.jpg' },
    ];
    this.siguienteIdCarrusel = 4;

    this.navbar = configDefault.navbar;
    this.colores = configDefault.colores;
    this.botones = configDefault.botones;
    this.modales = configDefault.modales;
    
    // Resetear configuración de historial
    this.historialHabilitado = true;
    localStorage.setItem('agrovision_historial_habilitado', JSON.stringify(true));

    this.mostrarModalResetExito = true;
  }

  cerrarModalResetExito(): void {
    this.mostrarModalResetExito = false;
  }

  // ========== VISTA PREVIA DE BACKDROP ==========
  getBackdropPreview(): string {
    const r = parseInt(this.modales.colorBackdrop.slice(1, 3), 16);
    const g = parseInt(this.modales.colorBackdrop.slice(3, 5), 16);
    const b = parseInt(this.modales.colorBackdrop.slice(5, 7), 16);
    const opacity = this.modales.opacidadBackdrop / 100;
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }
}

