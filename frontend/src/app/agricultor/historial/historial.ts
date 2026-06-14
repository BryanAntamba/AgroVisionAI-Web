import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BarraAgricultor } from '../../navbars/barra-agricultor/barra-agricultor';
import { traducirDiagnostico } from '../../shared/utils/traductor-enfermedades/clases-enfermedad';
import { ModalReporte } from '../modales/modal-reporte/modal-reporte';
import { RegistroHistorial, historialSimulado } from '../../../environments/historial';

// Definición de los posibles estados para filtrar el historial de reportes
type EstadoFiltro = 'Todos' | 'Sano' | 'Alerta' | 'Crítico';

@Component({
  selector: 'app-historial',
  standalone: true,
  // Importamos módulos de Angular y los componentes que se van a usar en la vista (barra superior, modales, etc.)
  imports: [CommonModule, FormsModule, BarraAgricultor, ModalReporte],
  templateUrl: './historial.html',
  styleUrl: './historial.css',
})
export class Historial implements OnInit {
  // Variables enlazadas al buscador y a los filtros de la vista HTML
  busqueda = '';
  filtroEstado: EstadoFiltro = 'Todos';
  fechaInicio = '';
  fechaFin = '';

  // Array que almacena todos los registros cargados
  registros: RegistroHistorial[] = [];
  // Guarda el registro al que el usuario le da click para ver los detalles en el modal
  registroSeleccionado: RegistroHistorial | null = null;

  ngOnInit(): void {
    // Intenta cargar los registros guardados previamente en el almacenamiento local del navegador
    const historialGuardado = localStorage.getItem('agrovision_historial');
    if (historialGuardado) {
      // Si existe, lo convierte de JSON a objeto de JavaScript y lo asigna
      this.registros = JSON.parse(historialGuardado);
    } else {
      // Si no existe, usa los datos simulados por defecto como base de ejemplo
      this.registros = [...historialSimulado];
    }
  }

  // Getter (propiedad computada) que devuelve la lista de registros tras aplicar los filtros actuales
  get registrosFiltrados(): RegistroHistorial[] {
    const termino = this.normalizar(this.busqueda);

    return this.registros
      .filter((registro) => {
        // 1. Filtro por coincidencia de texto (Diagnóstico)
        const diagnosticoNormalizado = this.normalizar(registro.diagnostico);
        const coincidenciaBusqueda = !termino || diagnosticoNormalizado.includes(termino);
        
        // 2. Filtro por el estado de salud (Todos, Sano, Alerta, Crítico)
        const estadoRegistro = this.obtenerEstado(registro.salud);
        const coincidenciaEstado = this.filtroEstado === 'Todos' || estadoRegistro === this.filtroEstado;
        
        // 3. Filtro por el rango de fechas seleccionado
        const coincidenciaFecha = this.coincideFecha(registro.fecha);

        // Retorna true solo si el registro cumple las 3 condiciones a la vez
        return coincidenciaBusqueda && coincidenciaEstado && coincidenciaFecha;
      })
      .sort((a, b) => {
        // Ordena los resultados de más reciente a más antiguo según la fecha y hora
        return new Date(`${b.fecha}T${b.hora}`).getTime() - new Date(`${a.fecha}T${a.hora}`).getTime();
      });
  }

  // Cuenta el total de reportes registrados
  get totalReportes(): number {
    return this.registros.length;
  }

  // Cuenta cuántos reportes corresponden al estado "Sano"
  get totalSanos(): number {
    return this.registros.filter(r => this.obtenerEstado(r.salud) === 'Sano').length;
  }

  // Cuenta cuántos reportes corresponden al estado "Alerta"
  get totalAlerta(): number {
    return this.registros.filter(r => this.obtenerEstado(r.salud) === 'Alerta').length;
  }

  // Cuenta cuántos reportes corresponden al estado "Crítico"
  get totalCriticos(): number {
    return this.registros.filter(r => this.obtenerEstado(r.salud) === 'Crítico').length;
  }

  // Convierte el valor numérico de salud (0-100) en una categoría de texto
  obtenerEstado(salud: number): EstadoFiltro {
    if (salud >= 80) return 'Sano';
    if (salud >= 50) return 'Alerta';
    return 'Crítico';
  }

  // Devuelve la clase CSS correspondiente según el estado de salud para cambiar colores
  obtenerClaseEstado(salud: number): string {
    const estado = this.obtenerEstado(salud);
    if (estado === 'Sano') return 'active'; // Verde
    if (estado === 'Alerta') return 'role'; // Amarillo / Azulado
    return 'offline'; // Rojo
  }

  // Verifica si la fecha de un registro está dentro del rango seleccionado por el usuario
  private coincideFecha(fechaRegistro: string): boolean {
    if (!this.fechaInicio && !this.fechaFin) {
      return true; // Si no hay filtros de fecha, pasa todos
    }

    const fecha = new Date(`${fechaRegistro}T00:00:00`);
    const inicio = this.fechaInicio ? new Date(`${this.fechaInicio}T00:00:00`) : null;
    const fin = this.fechaFin ? new Date(`${this.fechaFin}T23:59:59`) : null;

    // Si hay 'inicio', la fecha debe ser mayor o igual. Si hay 'fin', la fecha debe ser menor o igual.
    return (!inicio || fecha >= inicio) && (!fin || fecha <= fin);
  }

  // Quita tildes, mayúsculas y espacios extra para hacer la búsqueda de texto más permisiva
  private normalizar(valor: string): string {
    return valor
      .toLowerCase()
      .normalize('NFD') // Separa las letras de sus acentos
      .replace(/[\u0300-\u036f]/g, '') // Elimina los caracteres de acento
      .trim();
  }

  // Asigna un registro a la variable para que se muestre en el componente ModalReporte
  abrirReporte(registro: RegistroHistorial): void {
    this.registroSeleccionado = registro;
  }

  // Limpia la variable para ocultar el modal de reporte
  cerrarModalReporte(): void {
    this.registroSeleccionado = null;
  }

  // Convierte la fecha estándar a un formato legible en español (ej. "15 oct 2023 · 3:30 pm")
  formatearFecha(fecha: string, hora: string): string {
    const meses = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
    const partes = fecha.split('-');
    const anio = partes[0];
    const mes = meses[parseInt(partes[1], 10) - 1]; // Toma el número del mes y busca el nombre
    const dia = parseInt(partes[2], 10);
    
    const horaPartes = hora.split(':');
    const horas = parseInt(horaPartes[0], 10);
    const minutos = horaPartes[1];
    const periodo = horas >= 12 ? 'pm' : 'am';
    const hora12 = horas % 12 || 12; // Convierte la hora militar (24h) a formato de 12h
    
    return `${dia} ${mes} ${anio} · ${hora12}:${minutos} ${periodo}`;
  }
}
