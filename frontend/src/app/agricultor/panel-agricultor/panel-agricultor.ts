import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BarraAgricultor } from '../barra-agricultor/barra-agricultor';
import { BotonIOT } from '../boton-inicio/boton-iot/boton-iot';
import { datosIOTSimulados } from '../../../environments/datos-iot-simulados';
import {
  alertasActivasAlInicio,
  catalogoAlertasSensores,
  TipoAlertaSensor,
} from '../../../environments/datos-alertas-simuladas';
import { RecomendacionesStore } from '../../../environments/modales-recomendacion';
import { traducirDiagnostico } from '../../shared/mappers/clases-enfermedad';
import { AlertaDht22 } from '../modales/alerta-dht22/alerta-dht22';
import { AlertaCam } from '../modales/alerta-cam/alerta-cam';
import { AlertaCapaciteV2 } from '../modales/alerta-capacite-v2/alerta-capacite-v2';
import { AlertaAntenaWifi } from '../modales/alerta-antena-wifi/alerta-antena-wifi';
import { AlertaSensorLdr } from '../modales/alerta-sensor-ldr/alerta-sensor-ldr';

type PillTipo = 'ok' | 'warn' | 'est' | 'crit';
type RecTipo = 'ok' | 'warn' | 'crit';
type MetricaEstado = 'ok' | 'warn' | 'crit';

interface TarjetaSensor {
  id: string;
  nombre: string;
  valorNum: string;
  unidad: string;
  icono: string;
  pills: { texto: string; tipo: PillTipo }[];
  barPct: number;
  barColor: string;
  rangos: string[];
  optimo: string;
  dispositivo: string;
  estimado: boolean;
  notaEstimado?: string;
}

interface PrediccionFila {
  nombre: string;
  porcentaje: number;
  color: string;
}

interface MetricaLesionCard {
  id: string;
  nombre: string;
  icono: string;
  valorNum: string;
  unidad: string;
  pill: string;
  pillTipo: MetricaEstado;
  dotLeft: number;
  escalaLabels: string[];
  leyenda: { color: string; texto: string }[];
}

interface BarraSalud {
  etiqueta: string;
  valor: number;
  color: string;
}

interface RecomendacionVista {
  tipo: 'ok' | 'warn' | 'crit';
  titulo: string;
  mensaje: string;
  accion: string;
  icono: string;
}

@Component({
  selector: 'app-panel-agricultor',
  standalone: true,
  imports: [
    CommonModule,
    BarraAgricultor,
    BotonIOT,
    AlertaDht22,
    AlertaCam,
    AlertaCapaciteV2,
    AlertaAntenaWifi,
    AlertaSensorLdr,
  ],
  templateUrl: './panel-agricultor.html',
  styleUrl: './panel-agricultor.css',
})
export class PanelAgricultor implements OnInit, OnDestroy {
  readonly circunferenciaAnillo = 213.6;

  dispositivoConectado = false;
  dispositivoDesconectado = false;
  datos = datosIOTSimulados;

  isDisconnecting = false;
  isReconnecting = false;
  mostrarModalApagado = false;
  mostrarModalReporteGuardado = false;
  errorReconexion = '';
  fechaUltimaCaptura = datosIOTSimulados.meta.fecha_captura;
  alertasVisibles: TipoAlertaSensor[] = [];

  private intentosReconexion = 0;
  private intervaloCaptura: ReturnType<typeof setInterval> | null = null;

  private readonly coloresPrediccion: Record<string, string> = {
    healthy: '#55a820',
    early_blight: '#b56c07',
    late_blight: '#c62828',
    leaf_mold: '#7F77DD',
    septoria: '#597268',
    bacterial_spot: '#E91E63',
    spider_mites: '#FF5722',
    target_spot: '#607D8B',
    mosaic_virus: '#3F51B5',
    yellow_leaf_curl: '#FFC107',
  };

  private readonly coloresBarrasSalud = ['#55a820', '#63A022', '#97C459'];

  ngOnInit(): void {
    const estado = localStorage.getItem('dispositivoConectado');
    const desconectado = localStorage.getItem('dispositivoDesconectado');
    this.dispositivoConectado = estado === 'true';
    this.dispositivoDesconectado = desconectado === 'true';

    if (this.dispositivoConectado && !this.dispositivoDesconectado) {
      this.iniciarSimulacionCapturas();
    }

    this.alertasVisibles = [...alertasActivasAlInicio];
  }

  ngOnDestroy(): void {
    this.detenerSimulacionCapturas();
  }

  get etiquetaPlanta(): string {
    const n = this.datos.captura.numero_planta;
    return `Planta #${String(n).padStart(2, '0')}`;
  }

  get estadoConexionTexto(): string {
    return this.dispositivoDesconectado ? 'Dispositivo desconectado' : 'Dispositivo conectado';
  }

  get recomendaciones(): RecomendacionVista[] {
    return RecomendacionesStore.paraDashboard();
  }

  getAlerta(id: TipoAlertaSensor) {
    return catalogoAlertasSensores[id];
  }

  cerrarAlerta(id: TipoAlertaSensor): void {
    this.alertasVisibles = this.alertasVisibles.filter((a) => a !== id);
  }

  guardarReporte(): void {
    const ahora = new Date();
    const reporte = {
      id: Date.now(),
      fecha: ahora.toISOString().slice(0, 10),
      hora: ahora.toTimeString().slice(0, 5),
      planta: this.etiquetaPlanta,
      diagnostico: this.diagnosticoEspanol,
      confianza: this.datos.diagnostico_final.confianza_final,
      salud: this.datos.indice_salud.valor,
      temperatura: this.datos.sensores_tiempo_real.temperatura_aire_c,
      humedadAire: this.datos.sensores_tiempo_real.humedad_aire_pct,
      humedadSuelo: this.datos.sensores_tiempo_real.humedad_suelo_pct,
      luz: this.datos.sensores_tiempo_real.intensidad_luz_lux,
    };

    const prev = JSON.parse(localStorage.getItem('agrovision_historial') ?? '[]');
    prev.unshift(reporte);
    localStorage.setItem('agrovision_historial', JSON.stringify(prev));
    this.mostrarModalReporteGuardado = true;
  }

  cerrarModalReporteGuardado(): void {
    this.mostrarModalReporteGuardado = false;
  }

  onConectadoDispositivo(conectado: boolean): void {
    this.dispositivoConectado = conectado;
    this.dispositivoDesconectado = false;
    this.errorReconexion = '';
    this.intentosReconexion = 0;
    localStorage.setItem('dispositivoConectado', conectado ? 'true' : 'false');
    localStorage.setItem('dispositivoDesconectado', 'false');
    if (conectado) {
      this.iniciarSimulacionCapturas();
    }
  }

  abrirModalApagado(): void {
    this.mostrarModalApagado = true;
  }

  cerrarModalApagado(): void {
    this.mostrarModalApagado = false;
  }

  confirmarApagado(): void {
    this.cerrarModalApagado();
    this.desconectarDispositivo();
  }

  desconectarDispositivo(): void {
    if (this.isDisconnecting) return;
    this.isDisconnecting = true;
    this.detenerSimulacionCapturas();
    setTimeout(() => {
      this.isDisconnecting = false;
      this.dispositivoDesconectado = true;
      this.errorReconexion = '';
      this.intentosReconexion = 0;
      localStorage.setItem('dispositivoConectado', 'true');
      localStorage.setItem('dispositivoDesconectado', 'true');
    }, 2000);
  }

  reconectarDispositivo(): void {
    if (this.isReconnecting) return;
    this.isReconnecting = true;
    this.errorReconexion = '';

    setTimeout(() => {
      this.isReconnecting = false;
      this.intentosReconexion++;

      if (this.intentosReconexion < this.datos.reconexion.intentos_para_exito) {
        this.errorReconexion = 'No se pudo conectar el dispositivo. Inténtelo de nuevo.';
        return;
      }

      this.intentosReconexion = 0;
      this.dispositivoDesconectado = false;
      localStorage.setItem('dispositivoConectado', 'true');
      localStorage.setItem('dispositivoDesconectado', 'false');
      this.iniciarSimulacionCapturas();
    }, 2000);
  }

  private iniciarSimulacionCapturas(): void {
    this.detenerSimulacionCapturas();
    this.intervaloCaptura = setInterval(() => {
      if (this.dispositivoDesconectado) return;
      this.fechaUltimaCaptura = this.formatearFechaCaptura(new Date());
      // Cuando exista la cámara, aquí se asignará datos.imagenes.original con la URL recibida
      // this.datos.imagenes.tiene_captura = true;
    }, this.datos.captura.intervalo_nueva_captura_ms);
  }

  private detenerSimulacionCapturas(): void {
    if (this.intervaloCaptura) {
      clearInterval(this.intervaloCaptura);
      this.intervaloCaptura = null;
    }
  }

  private formatearFechaCaptura(fecha: Date): string {
    const meses = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
    const dia = fecha.getDate();
    const mes = meses[fecha.getMonth()];
    const anio = fecha.getFullYear();
    const horas = fecha.getHours();
    const minutos = String(fecha.getMinutes()).padStart(2, '0');
    const periodo = horas >= 12 ? 'pm' : 'am';
    const hora12 = horas % 12 || 12;
    return `${dia} ${mes} ${anio} · ${hora12}:${minutos} ${periodo}`;
  }

  get diagnosticoEspanol(): string {
    return traducirDiagnostico(this.datos.diagnostico_final.diagnostico_final);
  }

  get diagnosticoEsSano(): boolean {
    const d = this.diagnosticoEspanol.toLowerCase();
    return d.includes('sano') || d.includes('saludable');
  }

  get offsetAnilloSalud(): number {
    return this.circunferenciaAnillo - (this.circunferenciaAnillo * this.datos.indice_salud.valor) / 100;
  }

  get barrasSalud(): BarraSalud[] {
    return this.datos.indice_salud.componentes.map((c, i) => ({
      etiqueta: c.etiqueta,
      valor: c.valor,
      color: this.coloresBarrasSalud[i] ?? '#55a820',
    }));
  }

  get tarjetasSensores(): TarjetaSensor[] {
    const s = this.datos.sensores_tiempo_real;
    const c = this.datos.sensores_complementarios;

    const tempOk = this.enRango(s.temperatura_aire_c, s.temperatura_optima_min, s.temperatura_optima_max);
    const humOk = this.enRango(s.humedad_aire_pct, s.humedad_aire_optima_min, s.humedad_aire_optima_max);
    const sueloOk = s.humedad_suelo_pct >= s.riego_minimo;
    const luzOk = this.enRango(s.intensidad_luz_lux, s.luz_optima_min, s.luz_optima_max);
    const hojaBaja = c.humedad_hoja_pct < c.humedad_hoja_optima_min;

    return [
      {
        id: 'temp',
        nombre: 'Temperatura del aire',
        valorNum: String(s.temperatura_aire_c),
        unidad: ' °C',
        icono: 'fa-temperature-half',
        pills: [{ texto: tempOk ? 'Óptimo' : 'Fuera de rango', tipo: tempOk ? 'ok' : 'warn' }],
        barPct: this.pct(s.temperatura_aire_c, s.temperatura_sensor_min, s.temperatura_sensor_max),
        barColor: '#55a820',
        rangos: [`${s.temperatura_sensor_min} °C`, `${s.temperatura_sensor_max} °C`],
        optimo: `Óptimo cultivo: ${s.temperatura_optima_min}–${s.temperatura_optima_max} °C`,
        dispositivo: `Rango sensor: ${s.temperatura_sensor_min}–${s.temperatura_sensor_max} °C`,
        estimado: false,
      },
      {
        id: 'hum-aire',
        nombre: 'Humedad del aire',
        valorNum: String(s.humedad_aire_pct),
        unidad: ' %',
        icono: 'fa-droplet',
        pills: [{ texto: humOk ? 'Normal' : 'Alerta', tipo: humOk ? 'ok' : 'warn' }],
        barPct: this.pct(s.humedad_aire_pct, 15, 100),
        barColor: '#378ADD',
        rangos: ['15 %', '100 %'],
        optimo: `Óptimo cultivo: ${s.humedad_aire_optima_min}–${s.humedad_aire_optima_max} %`,
        dispositivo: 'Rango sensor: 15–100 %',
        estimado: false,
      },
      {
        id: 'suelo',
        nombre: 'Humedad del suelo',
        valorNum: String(s.humedad_suelo_pct),
        unidad: ' %',
        icono: 'fa-seedling',
        pills: [{ texto: sueloOk ? 'Normal' : 'Riego necesario', tipo: sueloOk ? 'ok' : 'warn' }],
        barPct: this.pct(s.humedad_suelo_pct, 10, 100),
        barColor: '#55a820',
        rangos: ['10 %', '100 %'],
        optimo: `Mínimo recomendado: ${s.riego_minimo} %`,
        dispositivo: 'Rango sensor: 10–100 %',
        estimado: false,
      },
      {
        id: 'luz',
        nombre: 'Intensidad de luz',
        valorNum: `${Math.round(s.intensidad_luz_lux / 1000)}k`,
        unidad: ' lux',
        icono: 'fa-sun',
        pills: [{ texto: luzOk ? 'Óptimo' : 'Fuera de rango', tipo: luzOk ? 'ok' : 'warn' }],
        barPct: this.pct(s.intensidad_luz_lux, 0, 150000),
        barColor: '#b56c07',
        rangos: ['0', '150 000 lux'],
        optimo: `Óptimo cultivo: ${s.luz_optima_min / 1000}k–${s.luz_optima_max / 1000}k lux`,
        dispositivo: 'Rango sensor: 0–150 000 lux',
        estimado: false,
      },
      {
        id: 'hoja',
        nombre: 'Humedad de la hoja',
        valorNum: String(c.humedad_hoja_pct),
        unidad: ' %',
        icono: 'fa-leaf',
        pills: [
          { texto: hojaBaja ? 'Bajo' : 'Normal', tipo: hojaBaja ? 'warn' : 'ok' },
          { texto: 'Estimado', tipo: 'est' },
        ],
        barPct: this.pct(c.humedad_hoja_pct, 0, 100),
        barColor: '#b56c07',
        rangos: ['0 %', '55 %', '85 %', '100 %'],
        optimo: `Óptimo cultivo: ${c.humedad_hoja_optima_min}–${c.humedad_hoja_optima_max} %`,
        dispositivo: 'Rango sensor: 0–100 %',
        estimado: true,
        notaEstimado: 'Sin sensor físico · calculado por IA',
      },
      {
        id: 'aire',
        nombre: 'Flujo de aire',
        valorNum: String(c.flujo_aire_ms),
        unidad: ' m/s',
        icono: 'fa-wind',
        pills: [{ texto: 'Estimado', tipo: 'est' }],
        barPct: this.pct(c.flujo_aire_ms, 0, 5),
        barColor: '#378ADD',
        rangos: ['0', '0.3', '1.5', '5 m/s'],
        optimo: `Referencia invernadero: ${c.flujo_aire_ref_min}–${c.flujo_aire_ref_max} m/s`,
        dispositivo: 'Rango sensor: 0–5 m/s',
        estimado: true,
        notaEstimado: 'Sin sensor físico · calculado por IA',
      },
    ];
  }

  get predicciones(): PrediccionFila[] {
    const preds = this.datos.diagnostico_final.predicciones as Record<string, number>;
    return Object.entries(preds)
      .map(([clave, porcentaje]) => ({
        nombre: traducirDiagnostico(clave),
        porcentaje,
        color: this.coloresPrediccion[clave] ?? '#597268',
      }))
      .sort((a, b) => b.porcentaje - a.porcentaje);
  }

  get metricasLesion(): MetricaLesionCard[] {
    const m = this.datos.metricas_lesion;
    return [
      this.metricaCard('area', 'fa-shapes', '% Área afectada', m.area_afectada_pct, '%', [0, 10, 30, 100], [
        { max: 10, estado: 'ok', pill: 'Normal' },
        { max: 30, estado: 'warn', pill: 'Atención' },
        { max: 100, estado: 'crit', pill: 'Grave' },
      ]),
      this.metricaCard('amarillo', 'fa-sun', '% Amarillo (clorosis)', m.area_amarilla_pct, '%', [0, 5, 15, 100], [
        { max: 5, estado: 'ok', pill: 'Normal' },
        { max: 15, estado: 'warn', pill: 'Atención' },
        { max: 100, estado: 'crit', pill: 'Grave' },
      ]),
      this.metricaCard('marron', 'fa-droplet-slash', '% Marrón (necrosis)', m.area_marron_pct, '%', [0, 5, 20, 100], [
        { max: 5, estado: 'ok', pill: 'Normal' },
        { max: 20, estado: 'warn', pill: 'Atención' },
        { max: 100, estado: 'crit', pill: 'Grave' },
      ]),
      this.metricaCard('manchas', 'fa-circle-nodes', 'Manchas detectadas', m.manchas_detectadas, ' manchas', [0, 3, 10, 15], [
        { max: 3, estado: 'ok', pill: 'Normal' },
        { max: 10, estado: 'warn', pill: 'Atención' },
        { max: 15, estado: 'crit', pill: 'Grave' },
      ]),
    ];
  }

  private metricaCard(
    id: string,
    icono: string,
    nombre: string,
    valor: number,
    unidad: string,
    escalaLabels: number[],
    umbrales: { max: number; estado: MetricaEstado; pill: string }[]
  ): MetricaLesionCard {
    const umbral = umbrales.find((u) => valor <= u.max) ?? umbrales[umbrales.length - 1];
    const maxEscala = escalaLabels[escalaLabels.length - 1];
    const dotLeft = Math.min(100, (valor / maxEscala) * 100);

    const leyendasPorId: Record<string, { color: string; texto: string }[]> = {
      area: [
        { color: '#55a820', texto: 'Normal 0–10 %' },
        { color: '#b56c07', texto: 'Alerta 10–30 %' },
        { color: '#c62828', texto: 'Crítico >30 %' },
      ],
      amarillo: [
        { color: '#55a820', texto: 'Normal 0–5 %' },
        { color: '#b56c07', texto: 'Alerta 5–15 %' },
        { color: '#c62828', texto: 'Crítico >15 %' },
      ],
      marron: [
        { color: '#55a820', texto: 'Normal 0–5 %' },
        { color: '#b56c07', texto: 'Alerta 5–20 %' },
        { color: '#c62828', texto: 'Crítico >20 %' },
      ],
      manchas: [
        { color: '#55a820', texto: 'Normal 0–3' },
        { color: '#b56c07', texto: 'Alerta 4–10' },
        { color: '#c62828', texto: 'Crítico >10' },
      ],
    };

    return {
      id,
      nombre,
      icono,
      valorNum: String(valor),
      unidad,
      pill: umbral.pill,
      pillTipo: umbral.estado,
      dotLeft,
      escalaLabels: escalaLabels.map(String),
      leyenda: leyendasPorId[id],
    };
  }

  private enRango(valor: number, min: number, max: number): boolean {
    return valor >= min && valor <= max;
  }

  private pct(valor: number, min: number, max: number): number {
    return Math.min(100, Math.max(0, ((valor - min) / (max - min)) * 100));
  }
}
