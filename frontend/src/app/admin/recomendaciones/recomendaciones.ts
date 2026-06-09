// Importa el módulo común de Angular con directivas básicas como *ngIf y *ngFor
import { CommonModule } from '@angular/common';
// Importa el decorador Component y la interfaz OnInit para el ciclo de vida del componente
import { Component, OnInit } from '@angular/core';
// Importa el módulo de formularios para usar [(ngModel)] en los inputs
import { FormsModule } from '@angular/forms';
// Importa el componente de barra de navegación del administrador
import { BarraAdmin } from '../../navbars/barra-admin/barra-admin';
// Importa los tipos, interfaces y funciones helper relacionadas con recomendaciones
import {
  // Tipo para la prioridad de una recomendación
  PrioridadRecomendacion,
  // Interfaz que define la estructura de una recomendación registrada
  RecomendacionRegistrada,
  // Servicio/store que maneja el estado y operaciones CRUD de recomendaciones
  RecomendacionesStore,
  // Función que convierte el color a tipo de recomendación para el dashboard
  colorATipoDashboard,
  // Función que devuelve el ícono apropiado según el color de la recomendación
  colorAIcono,
} from '../../../environments/modales-recomendacion';
// Importa el componente modal para registrar nuevas recomendaciones y su interfaz de datos
import { RegistrarRecomendacion, DatosRecomendacionForm } from '../modalesRecomedacion/registrar-recomendacion/registrar-recomendacion';
// Importa el componente modal para editar recomendaciones existentes
import { EditarRecomendacion } from '../modalesRecomedacion/editar-recomendacion/editar-recomendacion';
// Importa el componente modal para visualizar detalles de una recomendación
import { VisualizarRecomendacion } from '../modalesRecomedacion/visualizar-recomendacion/visualizar-recomendacion';
// Importa el componente modal para confirmar eliminación de recomendaciones
import { EliminarRecomendacion } from '../modalesRecomedacion/eliminar-recomendacion/eliminar-recomendacion';

// Decorador @Component que define los metadatos del componente de recomendaciones
@Component({
  // Selector CSS para usar este componente como <app-recomendaciones>
  selector: 'app-recomendaciones',
  // Indica que este componente es standalone (no requiere NgModule)
  standalone: true,
  // Array de módulos y componentes que puede usar en su template
  imports: [
    // Módulo para usar directivas comunes de Angular
    CommonModule,
    // Módulo para usar two-way binding con [(ngModel)]
    FormsModule,
    // Componente de barra de navegación del admin
    BarraAdmin,
    // Componente modal para registrar recomendaciones
    RegistrarRecomendacion,
    // Componente modal para editar recomendaciones
    EditarRecomendacion,
    // Componente modal para visualizar recomendaciones
    VisualizarRecomendacion,
    // Componente modal para eliminar recomendaciones
    EliminarRecomendacion,
  ],
  // Ruta al archivo HTML del template
  templateUrl: './recomendaciones.html',
  // Ruta al archivo CSS de estilos
  styleUrl: './recomendaciones.css',
})
// Clase que implementa la interfaz OnInit para ejecutar lógica al inicializar
export class Recomendaciones implements OnInit {
  // Propiedad para almacenar el término de búsqueda ingresado por el usuario
  busqueda = '';
  // Propiedad para almacenar el filtro de prioridad seleccionado (puede ser una prioridad específica o 'Todas')
  filtroPrioridad: PrioridadRecomendacion | 'Todas' = 'Todas';

  // Array que almacena todas las recomendaciones sin filtrar
  lista: RecomendacionRegistrada[] = [];
  // Array que almacena las recomendaciones filtradas que se mostrarán en la vista
  vistaPrevia: RecomendacionRegistrada[] = [];

  // Bandera para controlar la visibilidad del modal de registro
  mostrarRegistrar = false;
  // Bandera para controlar la visibilidad del modal de edición
  mostrarEditar = false;
  // Bandera para controlar la visibilidad del modal de visualización
  mostrarVisualizar = false;
  // Bandera para controlar la visibilidad del modal de eliminación
  mostrarEliminar = false;
  // Propiedad para almacenar la recomendación actualmente seleccionada
  seleccionada: RecomendacionRegistrada | null = null;

  // Método del ciclo de vida que se ejecuta una vez al inicializar el componente
  ngOnInit(): void {
    // Carga todas las recomendaciones desde el store al inicializar
    this.refrescar();
  }

  // Método que recarga todas las recomendaciones desde el store y aplica filtros
  refrescar(): void {
    // Obtiene todas las recomendaciones del store y las asigna a la lista completa
    this.lista = RecomendacionesStore.obtenerTodas();
    // Aplica los filtros activos para actualizar la vista previa
    this.aplicarFiltros();
  }

  // Método que filtra las recomendaciones según la búsqueda y prioridad seleccionadas
  aplicarFiltros(): void {
    // Normaliza el término de búsqueda para comparación sin acentos ni mayúsculas
    const termino = this.normalizar(this.busqueda);
    // Filtra la lista completa aplicando los criterios de búsqueda y prioridad
    this.vistaPrevia = this.lista.filter((r) => {
      // Verifica si el término está vacío o coincide con título o descripción normalizados
      const coincideBusqueda =
        !termino ||
        this.normalizar(r.titulo).includes(termino) ||
        this.normalizar(r.descripcion).includes(termino);
      // Verifica si el filtro de prioridad es 'Todas' o coincide con la prioridad de la recomendación
      const coincidePrioridad = this.filtroPrioridad === 'Todas' || r.prioridad === this.filtroPrioridad;
      // Retorna true solo si ambos criterios coinciden
      return coincideBusqueda && coincidePrioridad;
    });
  }

  // Método helper que convierte el color de una recomendación a su tipo para el dashboard
  tipoRec(color: RecomendacionRegistrada['color']): string {
    // Llama a la función helper importada para obtener el tipo de dashboard según el color
    return colorATipoDashboard(color);
  }

  // Método helper que devuelve el ícono apropiado según el color de la recomendación
  iconoRec(color: RecomendacionRegistrada['color']): string {
    // Llama a la función helper importada para obtener el ícono según el color
    return colorAIcono(color);
  }

  // Método que abre el modal para registrar una nueva recomendación
  abrirRegistrar(): void {
    // Activa la bandera para mostrar el modal de registro
    this.mostrarRegistrar = true;
  }

  // Método que cierra el modal de registro
  cerrarRegistrar(): void {
    // Desactiva la bandera para ocultar el modal de registro
    this.mostrarRegistrar = false;
  }

  // Método que guarda una nueva recomendación y actualiza la lista
  guardarRegistro(datos: DatosRecomendacionForm): void {
    // Agrega la nueva recomendación al store usando los datos del formulario
    RecomendacionesStore.agregar(datos);
    // Cierra el modal de registro
    this.cerrarRegistrar();
    // Recarga la lista de recomendaciones para reflejar el nuevo registro
    this.refrescar();
  }

  // Método que abre el modal de edición para una recomendación específica
  abrirEditar(rec: RecomendacionRegistrada): void {
    // Almacena la recomendación seleccionada para pasarla al modal
    this.seleccionada = rec;
    // Activa la bandera para mostrar el modal de edición
    this.mostrarEditar = true;
  }

  // Método que cierra el modal de edición
  cerrarEditar(): void {
    // Desactiva la bandera para ocultar el modal de edición
    this.mostrarEditar = false;
    // Limpia la referencia a la recomendación seleccionada
    this.seleccionada = null;
  }

  // Método que guarda las modificaciones de una recomendación existente
  guardarEdicion(datos: DatosRecomendacionForm): void {
    // Verifica si hay una recomendación seleccionada, si no, sale del método
    if (!this.seleccionada) return;
    // Actualiza la recomendación en el store usando su ID y los nuevos datos
    RecomendacionesStore.actualizar(this.seleccionada.id, datos);
    // Cierra el modal de edición
    this.cerrarEditar();
    // Recarga la lista para reflejar los cambios
    this.refrescar();
  }

  // Método que abre el modal de visualización para ver los detalles completos de una recomendación
  abrirVisualizar(rec: RecomendacionRegistrada): void {
    // Almacena la recomendación seleccionada para mostrarla en el modal
    this.seleccionada = rec;
    // Activa la bandera para mostrar el modal de visualización
    this.mostrarVisualizar = true;
  }

  // Método que cierra el modal de visualización
  cerrarVisualizar(): void {
    // Desactiva la bandera para ocultar el modal de visualización
    this.mostrarVisualizar = false;
    // Limpia la referencia a la recomendación seleccionada
    this.seleccionada = null;
  }

  // Método que abre el modal de confirmación para eliminar una recomendación
  abrirEliminar(rec: RecomendacionRegistrada): void {
    // Almacena la recomendación que se desea eliminar
    this.seleccionada = rec;
    // Activa la bandera para mostrar el modal de confirmación de eliminación
    this.mostrarEliminar = true;
  }

  // Método que cierra el modal de confirmación de eliminación
  cerrarEliminar(): void {
    // Desactiva la bandera para ocultar el modal de eliminación
    this.mostrarEliminar = false;
    // Limpia la referencia a la recomendación seleccionada
    this.seleccionada = null;
  }

  // Método que confirma y ejecuta la eliminación de una recomendación
  confirmarEliminacion(): void {
    // Verifica si hay una recomendación seleccionada, si no, sale del método
    if (!this.seleccionada) return;
    // Elimina la recomendación del store usando su ID
    RecomendacionesStore.eliminar(this.seleccionada.id);
    // Cierra el modal de confirmación
    this.cerrarEliminar();
    // Recarga la lista para reflejar la eliminación
    this.refrescar();
  }

  // Método privado que normaliza texto para comparaciones sin acentos ni mayúsculas
  private normalizar(valor: string): string {
    return valor
      // Convierte todo el texto a minúsculas para comparación insensible a mayúsculas
      .toLowerCase()
      // Normaliza usando NFD para descomponer caracteres con diacríticos
      .normalize('NFD')
      // Elimina todos los caracteres diacríticos (acentos, tildes) usando regex
      .replace(/[\u0300-\u036f]/g, '')
      // Elimina espacios en blanco al inicio y final
      .trim();
  }
}
