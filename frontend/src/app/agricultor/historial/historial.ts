import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BarraAgricultor } from '../barra-agricultor/barra-agricultor';
import { traducirDiagnostico } from '../../shared/traductor-enfermedades/clases-enfermedad';
import { ModalReporte } from './modal/modal-reporte/modal-reporte';
import { RegistroHistorial, historialSimulado } from '../../../environments/historial';

type EstadoFiltro = 'Todos' | 'Sano' | 'Alerta' | 'Crítico';

@Component({
  selector: 'app-historial',
  standalone: true,
  imports: [CommonModule, FormsModule, BarraAgricultor, ModalReporte],
  templateUrl: './historial.html',
  styleUrl: './historial.css',
})
export class Historial implements OnInit {
  busqueda = '';
  filtroEstado: EstadoFiltro = 'Todos';
  fechaInicio = '';
  fechaFin = '';

  registros: RegistroHistorial[] = [];
  registroSeleccionado: RegistroHistorial | null = null;

  ngOnInit(): void {
    // Cargar registros desde localStorage
    const historialGuardado = localStorage.getItem('agrovision_historial');
    if (historialGuardado) {
      this.registros = JSON.parse(historialGuardado);
    } else {
      // Datos simulados
      this.registros = [...historialSimulado];
    }
  }

  get registrosFiltrados(): RegistroHistorial[] {
    const termino = this.normalizar(this.busqueda);

    return this.registros
      .filter((registro) => {
        const diagnosticoNormalizado = this.normalizar(registro.diagnostico);
        const coincidenciaBusqueda = !termino || diagnosticoNormalizado.includes(termino);
        
        const estadoRegistro = this.obtenerEstado(registro.salud);
        const coincidenciaEstado = this.filtroEstado === 'Todos' || estadoRegistro === this.filtroEstado;
        
        const coincidenciaFecha = this.coincideFecha(registro.fecha);

        return coincidenciaBusqueda && coincidenciaEstado && coincidenciaFecha;
      })
      .sort((a, b) => {
        // Ordenar por fecha descendente (más reciente primero)
        return new Date(`${b.fecha}T${b.hora}`).getTime() - new Date(`${a.fecha}T${a.hora}`).getTime();
      });
  }

  get totalReportes(): number {
    return this.registros.length;
  }

  get totalSanos(): number {
    return this.registros.filter(r => this.obtenerEstado(r.salud) === 'Sano').length;
  }

  get totalAlerta(): number {
    return this.registros.filter(r => this.obtenerEstado(r.salud) === 'Alerta').length;
  }

  get totalCriticos(): number {
    return this.registros.filter(r => this.obtenerEstado(r.salud) === 'Crítico').length;
  }

  obtenerEstado(salud: number): EstadoFiltro {
    if (salud >= 80) return 'Sano';
    if (salud >= 50) return 'Alerta';
    return 'Crítico';
  }

  obtenerClaseEstado(salud: number): string {
    const estado = this.obtenerEstado(salud);
    if (estado === 'Sano') return 'active';
    if (estado === 'Alerta') return 'role';
    return 'offline';
  }

  private coincideFecha(fechaRegistro: string): boolean {
    if (!this.fechaInicio && !this.fechaFin) {
      return true;
    }

    const fecha = new Date(`${fechaRegistro}T00:00:00`);
    const inicio = this.fechaInicio ? new Date(`${this.fechaInicio}T00:00:00`) : null;
    const fin = this.fechaFin ? new Date(`${this.fechaFin}T23:59:59`) : null;

    return (!inicio || fecha >= inicio) && (!fin || fecha <= fin);
  }

  private normalizar(valor: string): string {
    return valor
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim();
  }

  abrirReporte(registro: RegistroHistorial): void {
    this.registroSeleccionado = registro;
  }

  cerrarModalReporte(): void {
    this.registroSeleccionado = null;
  }

  formatearFecha(fecha: string, hora: string): string {
    const meses = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
    const partes = fecha.split('-');
    const anio = partes[0];
    const mes = meses[parseInt(partes[1], 10) - 1];
    const dia = parseInt(partes[2], 10);
    
    const horaPartes = hora.split(':');
    const horas = parseInt(horaPartes[0], 10);
    const minutos = horaPartes[1];
    const periodo = horas >= 12 ? 'pm' : 'am';
    const hora12 = horas % 12 || 12;
    
    return `${dia} ${mes} ${anio} · ${hora12}:${minutos} ${periodo}`;
  }
}
