// Importaciones de Angular y componentes internos
import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
// Importaciones de componentes de la interfaz de usuario (barra, botón IoT, modales)
import { BarraAgricultor } from '../../navbars/barra-agricultor/barra-agricultor';
import { BotonIOT } from '../boton-iot/boton-iot';
import { datosIOTSimulados } from '../../../environments/datos-iot-simulados';
import { alertasActivasAlInicio, catalogoAlertasSensores, TipoAlertaSensor } from '../../../environments/datos-alertas-simuladas';
import { RecomendacionesStore } from '../../../environments/modales-recomendacion';
import { traducirDiagnostico } from '../../shared/utils/traductor-enfermedades/clases-enfermedad';
// Modales de alertas de los diferentes sensores
import { AlertaDht22 } from '../modales/alerta-dht22/alerta-dht22';
import { AlertaCam } from '../modales/alerta-cam/alerta-cam';
import { AlertaCapaciteV2 } from '../modales/alerta-capacite-v2/alerta-capacite-v2';
import { AlertaAntenaWifi } from '../modales/alerta-antena-wifi/alerta-antena-wifi';
import { AlertaSensorLDR } from '../modales/alerta-sensor-ldr/alerta-sensor-ldr';
// Modales separados en componentes independientes
import { DesconectarDispositivo } from '../modales/desconectar-dispositivo/desconectar-dispositivo';
import { GuardarReporte } from '../modales/guardar-reporte/guardar-reporte';

// Definición de tipos de estado para las "píldoras" visuales (OK, Advertencia, Crítico, Estimado)
type PillTipo = 'ok' | 'warn' | 'est' | 'crit';
type RecTipo = 'ok' | 'warn' | 'crit';
type MetricaEstado = 'ok' | 'warn' | 'crit';

// Interfaz que define la estructura de datos para la tarjeta de cada sensor
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

// Interfaz para la lista de predicciones de diagnóstico
interface PrediccionFila {
  nombre: string;
  porcentaje: number;
  color: string;
}

// Interfaz para las métricas de lesión visual en la hoja
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

// Interfaz para la barra de salud (colores y porcentajes)
interface BarraSalud {
  etiqueta: string;
  valor: number;
  color: string;
}

// Interfaz para las recomendaciones generadas para el agricultor
interface RecomendacionVista {
  tipo: 'ok' | 'warn' | 'crit';
  titulo: string;
  mensaje: string;
  accion: string;
  icono: string;
}

// Decorador del componente principal del Panel del Agricultor
@Component({
  selector: 'app-panel-agricultor', // Selector HTML
  standalone: true, // Componente independiente
  // Importa todos los subcomponentes que se usarán en la vista
  imports: [
    CommonModule,
    BarraAgricultor,
    BotonIOT,
    AlertaDht22,
    AlertaCam,
    AlertaCapaciteV2,
    AlertaAntenaWifi,
    AlertaSensorLDR,
    DesconectarDispositivo,
    GuardarReporte,
  ],
  templateUrl: './panel-agricultor.html',
  styleUrl: './panel-agricultor.css',
})
export class PanelAgricultor implements OnInit, OnDestroy {
  // Constante para el perímetro del anillo SVG de salud
  readonly circunferenciaAnillo = 213.6;

  // Variables de estado de la conexión del dispositivo IoT
  dispositivoConectado = false;
  dispositivoDesconectado = false;
  
  // Datos simulados provenientes del "backend/entorno"
  datos = datosIOTSimulados;

  // Variables de control de modales y estados de botones
  isDisconnecting = false;
  isReconnecting = false;
  mostrarModalApagado = false;
  mostrarModalReporteGuardado = false;
  errorReconexion = '';
  
  // Fecha actual de la captura
  fechaUltimaCaptura = datosIOTSimulados.meta.fecha_captura;
  
  // Lista de alertas visibles en pantalla
  alertasVisibles: TipoAlertaSensor[] = [];

  // Controles internos de la simulación de reconexión y temporizador de capturas
  private intentosReconexion = 0;
  private intervaloCaptura: ReturnType<typeof setInterval> | null = null;

  // Mapa de colores asociados a cada tipo de enfermedad o diagnóstico
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

  // Colores para las barras de salud (de más grave a menos grave/saludable)
  private readonly coloresBarrasSalud = ['#55a820', '#63A022', '#97C459'];

  // Hook OnInit: Se ejecuta al inicializar el componente
  ngOnInit(): void {
    // Recupera el estado de conexión guardado en el navegador (Local Storage)
    const estado = localStorage.getItem('dispositivoConectado');
    const desconectado = localStorage.getItem('dispositivoDesconectado');
    this.dispositivoConectado = estado === 'true';
    this.dispositivoDesconectado = desconectado === 'true';

    // Si está conectado y no desconectado explícitamente, inicia la simulación de datos en vivo
    if (this.dispositivoConectado && !this.dispositivoDesconectado) {
      this.iniciarSimulacionCapturas();
    }

    // Carga las alertas activas por defecto
    this.alertasVisibles = [...alertasActivasAlInicio];
  }

  // Hook OnDestroy: Limpia recursos (como el intervalo) al cambiar de página
  ngOnDestroy(): void {
    this.detenerSimulacionCapturas();
  }

  // Obtiene el string de la planta con formato "Planta #01"
  get etiquetaPlanta(): string {
    const n = this.datos.captura.numero_planta;
    return `Planta #${String(n).padStart(2, '0')}`;
  }

  // Devuelve el texto descriptivo del estado de la conexión
  get estadoConexionTexto(): string {
    return this.dispositivoDesconectado ? 'Dispositivo desconectado' : 'Dispositivo conectado';
  }

  // Obtiene la lista de recomendaciones desde el store
  get recomendaciones(): RecomendacionVista[] {
    return RecomendacionesStore.paraDashboard();
  }

  // Obtiene los datos detallados de una alerta específica desde el catálogo
  getAlerta(id: TipoAlertaSensor) {
    return catalogoAlertasSensores[id];
  }

  // Remueve una alerta de la lista de alertas visibles (cuando el usuario la cierra)
  cerrarAlerta(id: TipoAlertaSensor): void {
    this.alertasVisibles = this.alertasVisibles.filter((a) => a !== id);
  }

  // Guarda una captura del estado actual de los sensores en el LocalStorage
  guardarReporte(): void {
    const ahora = new Date();
    // Construye el objeto reporte con los datos actuales
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

    // Obtiene el historial previo, agrega el nuevo reporte al inicio, y lo guarda
    const prev = JSON.parse(localStorage.getItem('agrovision_historial') ?? '[]');
    prev.unshift(reporte);
    localStorage.setItem('agrovision_historial', JSON.stringify(prev));
    // Muestra el modal de éxito
    this.mostrarModalReporteGuardado = true;
  }

  // Cierra el modal de reporte guardado
  cerrarModalReporteGuardado(): void {
    this.mostrarModalReporteGuardado = false;
  }

  // Callback cuando el usuario logra conectar el dispositivo IoT simulado
  onConectadoDispositivo(conectado: boolean): void {
    this.dispositivoConectado = conectado;
    this.dispositivoDesconectado = false;
    this.errorReconexion = '';
    this.intentosReconexion = 0;
    // Persiste el estado
    localStorage.setItem('dispositivoConectado', conectado ? 'true' : 'false');
    localStorage.setItem('dispositivoDesconectado', 'false');
    // Inicia capturas
    if (conectado) {
      this.iniciarSimulacionCapturas();
    }
  }

  // Muestra el modal de confirmación de desconexión
  abrirModalApagado(): void {
    this.mostrarModalApagado = true;
  }

  // Cierra el modal de confirmación de desconexión
  cerrarModalApagado(): void {
    this.mostrarModalApagado = false;
  }

  // Lógica para confirmar la desconexión desde el modal
  confirmarApagado(): void {
    this.cerrarModalApagado();
    this.desconectarDispositivo();
  }

  // Ejecuta la desconexión del dispositivo (con un timeout de 2 segundos)
  desconectarDispositivo(): void {
    if (this.isDisconnecting) return;
    this.isDisconnecting = true;
    this.detenerSimulacionCapturas(); // Detiene las capturas en vivo
    setTimeout(() => {
      this.isDisconnecting = false;
      this.dispositivoConectado = false;
      this.dispositivoDesconectado = true;
      this.errorReconexion = '';
      this.intentosReconexion = 0;
      // Persiste el estado como desconectado
      localStorage.setItem('dispositivoConectado', 'false');
      localStorage.setItem('dispositivoDesconectado', 'true');
    }, 2000);
  }

  // Simula el proceso de reconexión del dispositivo
  reconectarDispositivo(): void {
    if (this.isReconnecting) return;
    this.isReconnecting = true;
    this.errorReconexion = '';

    setTimeout(() => {
      this.isReconnecting = false;
      this.intentosReconexion++;

      // Simula que la reconexión puede fallar dependiendo de 'intentos_para_exito'
      if (this.intentosReconexion < this.datos.reconexion.intentos_para_exito) {
        this.errorReconexion = 'No se pudo conectar el dispositivo. Inténtelo de nuevo.';
        return;
      }

      // Si tiene éxito, restablece estados y reanuda capturas
      this.intentosReconexion = 0;
      this.dispositivoDesconectado = false;
      localStorage.setItem('dispositivoConectado', 'true');
      localStorage.setItem('dispositivoDesconectado', 'false');
      this.iniciarSimulacionCapturas();
    }, 2000);
  }

  // Inicia un intervalo (setInterval) para actualizar periódicamente los datos (Simulación en Vivo)
  private iniciarSimulacionCapturas(): void {
    this.detenerSimulacionCapturas();
    this.intervaloCaptura = setInterval(() => {
      if (this.dispositivoDesconectado) return;
      this.fechaUltimaCaptura = this.formatearFechaCaptura(new Date());
    }, this.datos.captura.intervalo_nueva_captura_ms);
  }

  // Detiene el intervalo de capturas en vivo
  private detenerSimulacionCapturas(): void {
    if (this.intervaloCaptura) {
      clearInterval(this.intervaloCaptura);
      this.intervaloCaptura = null;
    }
  }

  // Formatea la fecha al estilo "15 oct 2023 · 3:30 pm"
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

  // Traduce el diagnóstico (en inglés) al español usando la función auxiliar
  get diagnosticoEspanol(): string {
    return traducirDiagnostico(this.datos.diagnostico_final.diagnostico_final);
  }

  // Evalúa si el diagnóstico indica que la planta está sana
  get diagnosticoEsSano(): boolean {
    const d = this.diagnosticoEspanol.toLowerCase();
    return d.includes('sano') || d.includes('saludable');
  }

  // Calcula el desfase (dashoffset) para rellenar el anillo de salud según el porcentaje
  get offsetAnilloSalud(): number {
    return this.circunferenciaAnillo - (this.circunferenciaAnillo * this.datos.indice_salud.valor) / 100;
  }

  // Genera el arreglo de las barras de salud con sus respectivos porcentajes y colores
  get barrasSalud(): BarraSalud[] {
    return this.datos.indice_salud.componentes.map((c, i) => ({
      etiqueta: c.etiqueta,
      valor: c.valor,
      color: this.coloresBarrasSalud[i] ?? '#55a820',
    }));
  }

  // Construye dinámicamente las tarjetas de todos los sensores (Temperatura, Humedad, etc)
  get tarjetasSensores(): TarjetaSensor[] {
    const s = this.datos.sensores_tiempo_real;
    const c = this.datos.sensores_complementarios;

    // Evaluaciones lógicas para definir si el sensor está en un rango óptimo
    const tempOk = this.enRango(s.temperatura_aire_c, s.temperatura_optima_min, s.temperatura_optima_max);
    const humOk = this.enRango(s.humedad_aire_pct, s.humedad_aire_optima_min, s.humedad_aire_optima_max);
    const sueloOk = s.humedad_suelo_pct >= s.riego_minimo;
    const luzOk = this.enRango(s.intensidad_luz_lux, s.luz_optima_min, s.luz_optima_max);
    const hojaBaja = c.humedad_hoja_pct < c.humedad_hoja_optima_min;

    return [
      // Tarjeta de Temperatura
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
      // Tarjeta de Humedad del aire
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
      // Tarjeta de Humedad de suelo
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
      // Tarjeta de Intensidad de luz
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
      // Tarjeta de Humedad de la hoja (Sensor calculado)
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
      // Tarjeta de Flujo de aire (Sensor calculado)
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

  // Retorna las predicciones de la red neuronal ordenadas de mayor a menor probabilidad
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

  // Retorna los datos que rellenarán las tarjetas de "Métricas de Lesión" (Área, colores, manchas)
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

  // Función de fábrica (Factory) privada que ayuda a generar los objetos para `metricasLesion`
  private metricaCard(
    id: string,
    icono: string,
    nombre: string,
    valor: number,
    unidad: string,
    escalaLabels: number[],
    umbrales: { max: number; estado: MetricaEstado; pill: string }[]
  ): MetricaLesionCard {
    // Busca en qué umbral cae el valor (Normal, Alerta o Crítico)
    const umbral = umbrales.find((u) => valor <= u.max) ?? umbrales[umbrales.length - 1];
    const maxEscala = escalaLabels[escalaLabels.length - 1];
    // Calcula la posición del "punto" en la barra de colores semáforo
    const dotLeft = Math.min(100, (valor / maxEscala) * 100);

    // Leyendas explicativas para cada tarjeta según su ID
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

  // Verifica matemáticamente si un valor se encuentra dentro de un rango inclusivo
  private enRango(valor: number, min: number, max: number): boolean {
    return valor >= min && valor <= max;
  }

  // Transforma un valor escalar en un porcentaje de 0 a 100 con respecto a un rango (min y max)
  private pct(valor: number, min: number, max: number): number {
    return Math.min(100, Math.max(0, ((valor - min) / (max - min)) * 100));
  }
}
