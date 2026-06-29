import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecomendacionesStore } from '../../../../environments/modales-recomendacion';
import { RegistroHistorial } from '../../../../environments/historial';

interface PrediccionCondicion {
  nombre: string;
  porcentaje: number;
}

interface RecomendacionReporte {
  tipo: 'ok' | 'warn' | 'crit';
  titulo: string;
  mensaje: string;
  accion: string;
  icono: string;
}

@Component({
  selector: 'app-modal-reporte',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal-reporte.html',
  styleUrl: './modal-reporte.css',
})
export class ModalReporte implements OnInit {
  @Input() registro!: RegistroHistorial;
  @Output() cerrar = new EventEmitter<void>();

  predicciones: PrediccionCondicion[] = [];
  recomendaciones: RecomendacionReporte[] = [];

  ngOnInit(): void {
    this.cargarPredicciones();
    this.cargarRecomendaciones();
  }

  get fechaFormateada(): string {
    const meses = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
    const partes = this.registro.fecha.split('-');
    const anio = partes[0];
    const mes = meses[parseInt(partes[1], 10) - 1];
    const dia = parseInt(partes[2], 10);
    
    const horaPartes = this.registro.hora.split(':');
    const horas = parseInt(horaPartes[0], 10);
    const minutos = horaPartes[1];
    const periodo = horas >= 12 ? 'pm' : 'am';
    const hora12 = horas % 12 || 12;
    
    return `${dia} ${mes} ${anio} · ${hora12}:${minutos} ${periodo}`;
  }

  get esSano(): boolean {
    return this.registro.diagnostico.toLowerCase().includes('sano');
  }

  get mensajeDiagnostico(): string {
    if (this.esSano) {
      return 'No se detectaron enfermedades activas.';
    }
    return `Se detectó: ${this.registro.diagnostico}`;
  }

  get humedadHojaEstimada(): number {
    // Estimado basado en humedad del aire y suelo
    return Math.round((this.registro.humedadAire * 0.3 + this.registro.humedadSuelo * 0.2) / 2);
  }

  get flujoAireEstimado(): number {
    // Estimado simple basado en condiciones
    return 0.8;
  }

  get areaAfectada(): number {
    if (this.esSano) return 0;
    return Math.max(0, Math.min(100, 100 - this.registro.salud));
  }

  get porcentajeAmarillo(): number {
    if (this.esSano) return 2.1;
    return Math.max(2.1, (100 - this.registro.salud) * 0.3);
  }

  get porcentajeMarron(): number {
    if (this.esSano) return 1.4;
    return Math.max(1.4, (100 - this.registro.salud) * 0.2);
  }

  get manchasDetectadas(): number {
    if (this.esSano) return 0;
    return Math.floor((100 - this.registro.salud) / 10);
  }

  cerrarModal(): void {
    this.cerrar.emit();
  }

  private cargarPredicciones(): void {
    // Simulación de predicciones basadas en el diagnóstico
    const enfermedades = [
      'Tomate sano',
      'Tizón temprano',
      'Tizón tardío',
      'Moho foliar',
      'Mancha séptica'
    ];

    if (this.esSano) {
      this.predicciones = [
        { nombre: 'Tomate sano', porcentaje: this.registro.confianza },
        { nombre: 'Tizón temprano', porcentaje: 4.2 },
        { nombre: 'Tizón tardío', porcentaje: 1.9 },
        { nombre: 'Moho foliar', porcentaje: 0.9 },
        { nombre: 'Mancha séptica', porcentaje: 0.5 },
      ];
    } else {
      const principal = this.registro.diagnostico;
      const resto = enfermedades.filter(e => e !== principal);
      const restoPorcentaje = 100 - this.registro.confianza;
      
      this.predicciones = [
        { nombre: principal, porcentaje: this.registro.confianza },
        { nombre: resto[0], porcentaje: restoPorcentaje * 0.5 },
        { nombre: resto[1], porcentaje: restoPorcentaje * 0.25 },
        { nombre: resto[2], porcentaje: restoPorcentaje * 0.15 },
        { nombre: resto[3], porcentaje: restoPorcentaje * 0.1 },
      ];
    }
  }

  private cargarRecomendaciones(): void {
    // Obtener todas las recomendaciones registradas
    const todas = RecomendacionesStore.paraDashboard();
    
    if (this.esSano) {
      // Filtrar solo recomendaciones de tipo 'ok' (verde) para plantas sanas
      this.recomendaciones = todas.filter(r => r.tipo === 'ok');
    } else {
      // Filtrar recomendaciones de alerta y críticas para plantas enfermas
      this.recomendaciones = todas.filter(r => r.tipo === 'warn' || r.tipo === 'crit');
    }
  }
}
