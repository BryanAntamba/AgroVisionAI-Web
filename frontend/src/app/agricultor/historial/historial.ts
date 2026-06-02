import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BarraAgricultor } from '../barra-agricultor/barra-agricultor';

interface RegistroHistorial {
  id: number;
  fecha: string;
  hora: string;
  temperatura: number;
  humedadAire: number;
  humedadSuelo: number;
  luz: number;
  diagnostico: string;
  confianza: number;
  estadoSalud: 'Excelente' | 'Precaución' | 'Crítico';
}

@Component({
  selector: 'app-historial',
  standalone: true,
  imports: [CommonModule, FormsModule, BarraAgricultor],
  templateUrl: './historial.html',
  styleUrl: './historial.css',
})
export class Historial implements OnInit {
  busqueda = '';
  ordenAlfabetico = 'fecha-desc';
  filtroEstado = 'Todos';
  fechaInicio = '';
  fechaFin = '';

  registros: RegistroHistorial[] = [
    {
      id: 1,
      fecha: '2026-05-30',
      hora: '10:30',
      temperatura: 22.0,
      humedadAire: 65,
      humedadSuelo: 75,
      luz: 52000,
      diagnostico: 'Tomato Healthy',
      confianza: 92,
      estadoSalud: 'Excelente',
    },
    {
      id: 2,
      fecha: '2026-05-29',
      hora: '15:45',
      temperatura: 25.4,
      humedadAire: 60,
      humedadSuelo: 68,
      luz: 48000,
      diagnostico: 'Tomato Healthy',
      confianza: 89,
      estadoSalud: 'Excelente',
    },
    {
      id: 3,
      fecha: '2026-05-28',
      hora: '09:15',
      temperatura: 19.2,
      humedadAire: 82,
      humedadSuelo: 42,
      luz: 35000,
      diagnostico: 'Early Blight',
      confianza: 78,
      estadoSalud: 'Precaución',
    },
    {
      id: 4,
      fecha: '2026-05-27',
      hora: '11:00',
      temperatura: 26.1,
      humedadAire: 55,
      humedadSuelo: 35,
      luz: 62000,
      diagnostico: 'Late Blight',
      confianza: 85,
      estadoSalud: 'Crítico',
    },
    {
      id: 5,
      fecha: '2026-05-26',
      hora: '16:20',
      temperatura: 23.8,
      humedadAire: 68,
      humedadSuelo: 71,
      luz: 50000,
      diagnostico: 'Tomato Healthy',
      confianza: 91,
      estadoSalud: 'Excelente',
    }
  ];

  ngOnInit(): void {}

  get registrosFiltrados(): RegistroHistorial[] {
    const termino = this.normalizar(this.busqueda);

    return this.registros
      .filter((registro) => {
        const coincidenciaBusqueda =
          !termino ||
          this.normalizar(registro.diagnostico).includes(termino) ||
          this.normalizar(registro.fecha).includes(termino);
        const coincidenciaEstado =
          this.filtroEstado === 'Todos' || registro.estadoSalud === this.filtroEstado;
        const coincidenciaFecha = this.coincideFecha(registro.fecha);

        return coincidenciaBusqueda && coincidenciaEstado && coincidenciaFecha;
      })
      .sort((a, b) => {
        if (this.ordenAlfabetico === 'fecha-desc') {
          return new Date(`${b.fecha}T${b.hora}`).getTime() - new Date(`${a.fecha}T${a.hora}`).getTime();
        } else if (this.ordenAlfabetico === 'fecha-asc') {
          return new Date(`${a.fecha}T${a.hora}`).getTime() - new Date(`${b.fecha}T${b.hora}`).getTime();
        } else if (this.ordenAlfabetico === 'confianza-desc') {
          return b.confianza - a.confianza;
        }
        return 0;
      });
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
}
