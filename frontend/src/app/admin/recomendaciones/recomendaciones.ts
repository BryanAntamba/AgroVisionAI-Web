import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BarraAdmin } from '../../navbars/barra-admin/barra-admin';
import {
  PrioridadRecomendacion,
  RecomendacionRegistrada,
  RecomendacionesStore,
  colorATipoDashboard,
  colorAIcono,
} from '../../../environments/modales-recomendacion';
import { RegistrarRecomendacion, DatosRecomendacionForm } from '../modalesRecomedacion/registrar-recomendacion/registrar-recomendacion';
import { EditarRecomendacion } from '../modalesRecomedacion/editar-recomendacion/editar-recomendacion';
import { VisualizarRecomendacion } from '../modalesRecomedacion/visualizar-recomendacion/visualizar-recomendacion';
import { EliminarRecomendacion } from '../modalesRecomedacion/eliminar-recomendacion/eliminar-recomendacion';

@Component({
  selector: 'app-recomendaciones',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    BarraAdmin,
    RegistrarRecomendacion,
    EditarRecomendacion,
    VisualizarRecomendacion,
    EliminarRecomendacion,
  ],
  templateUrl: './recomendaciones.html',
  styleUrl: './recomendaciones.css',
})
export class Recomendaciones implements OnInit {
  busqueda = '';
  filtroPrioridad: PrioridadRecomendacion | 'Todas' = 'Todas';

  lista: RecomendacionRegistrada[] = [];
  vistaPrevia: RecomendacionRegistrada[] = [];

  mostrarRegistrar = false;
  mostrarEditar = false;
  mostrarVisualizar = false;
  mostrarEliminar = false;
  seleccionada: RecomendacionRegistrada | null = null;

  ngOnInit(): void {
    this.refrescar();
  }

  refrescar(): void {
    this.lista = RecomendacionesStore.obtenerTodas();
    this.aplicarFiltros();
  }

  aplicarFiltros(): void {
    const termino = this.normalizar(this.busqueda);
    this.vistaPrevia = this.lista.filter((r) => {
      const coincideBusqueda =
        !termino ||
        this.normalizar(r.titulo).includes(termino) ||
        this.normalizar(r.descripcion).includes(termino);
      const coincidePrioridad = this.filtroPrioridad === 'Todas' || r.prioridad === this.filtroPrioridad;
      return coincideBusqueda && coincidePrioridad;
    });
  }

  tipoRec(color: RecomendacionRegistrada['color']): string {
    return colorATipoDashboard(color);
  }

  iconoRec(color: RecomendacionRegistrada['color']): string {
    return colorAIcono(color);
  }

  abrirRegistrar(): void {
    this.mostrarRegistrar = true;
  }

  cerrarRegistrar(): void {
    this.mostrarRegistrar = false;
  }

  guardarRegistro(datos: DatosRecomendacionForm): void {
    RecomendacionesStore.agregar(datos);
    this.cerrarRegistrar();
    this.refrescar();
  }

  abrirEditar(rec: RecomendacionRegistrada): void {
    this.seleccionada = rec;
    this.mostrarEditar = true;
  }

  cerrarEditar(): void {
    this.mostrarEditar = false;
    this.seleccionada = null;
  }

  guardarEdicion(datos: DatosRecomendacionForm): void {
    if (!this.seleccionada) return;
    RecomendacionesStore.actualizar(this.seleccionada.id, datos);
    this.cerrarEditar();
    this.refrescar();
  }

  abrirVisualizar(rec: RecomendacionRegistrada): void {
    this.seleccionada = rec;
    this.mostrarVisualizar = true;
  }

  cerrarVisualizar(): void {
    this.mostrarVisualizar = false;
    this.seleccionada = null;
  }

  abrirEliminar(rec: RecomendacionRegistrada): void {
    this.seleccionada = rec;
    this.mostrarEliminar = true;
  }

  cerrarEliminar(): void {
    this.mostrarEliminar = false;
    this.seleccionada = null;
  }

  confirmarEliminacion(): void {
    if (!this.seleccionada) return;
    RecomendacionesStore.eliminar(this.seleccionada.id);
    this.cerrarEliminar();
    this.refrescar();
  }

  private normalizar(valor: string): string {
    return valor
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim();
  }
}
