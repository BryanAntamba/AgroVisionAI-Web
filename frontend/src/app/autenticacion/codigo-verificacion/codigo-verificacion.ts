// Importa módulos comunes y de núcleo de Angular, incluyendo OnDestroy y ChangeDetectorRef
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, OnDestroy, ChangeDetectorRef } from '@angular/core';
// Importa herramientas para formularios reactivos
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
// Importa validadores de patrones
import { ModalesValidaciones } from '../../shared/validators/modales-validaciones';
// Importa reglas de validación de autenticación
import { AutenticacionValidaciones } from '../../shared/validators/autenticacion-validaciones';

// Decorador del componente con sus metadatos
@Component({
  selector: 'app-codigo-verificacion', // Etiqueta HTML
  imports: [CommonModule, ReactiveFormsModule], // Módulos necesarios
  templateUrl: './codigo-verificacion.html', // Plantilla HTML
  styleUrls: [ // Estilos CSS aplicables
    './codigo-verificacion.css',
    '../../shared/styles/validacion-errores.css',
    '../../shared/styles/animaciones-autenticacion.css'
  ],
})
export class CodigoVerificacion implements OnDestroy {
  // Recibe el correo electrónico ingresado desde el componente padre
  @Input() correo = '';
  // Emite un evento cuando el código es verificado correctamente
  @Output() codigoVerificado = new EventEmitter<void>();
  // Emite un evento cuando se solicita el reenvío del código
  @Output() reenviarCodigo = new EventEmitter<void>();

  // Formulario reactivo para el código
  codigoForm: FormGroup;
  // Mensaje informativo sobre el reenvío del código
  mensajeReenvio = '';
  // Contador de cuántas veces se ha solicitado reenviar el código
  intentosReenvio = 0;
  // Bandera que indica si se alcanzó el límite de reenvíos permitidos
  limiteReenvioAlcanzado = false;
  // Referencia a las validaciones de autenticación para usarlas en la vista
  validators = AutenticacionValidaciones;
  
  // Tiempo restante de espera (en segundos) antes de poder volver a intentar
  tiempoRestante = 0;
  // Variable para almacenar la referencia al intervalo (temporizador)
  intervaloCountdown: ReturnType<typeof setInterval> | null = null;

  // Constructor que inyecta FormBuilder (formularios) y ChangeDetectorRef (para forzar actualizaciones de vista)
  constructor(private fb: FormBuilder, private cdr: ChangeDetectorRef) {
    // Inicializa el formulario
    this.codigoForm = this.fb.group({
      // Campo 'codigo' requerido y validado con un patrón específico (ej. 6 dígitos)
      codigo: ['', [Validators.required, Validators.pattern(ModalesValidaciones.CODIGO_VERIFICACION_PATTERN)]],
    });
  }

  // Método del ciclo de vida de Angular que se ejecuta justo antes de destruir el componente
  ngOnDestroy(): void {
    // Limpia el temporizador para evitar fugas de memoria
    this.detenerCountdown();
  }

  // Getter para acceder al control 'codigo' desde el HTML
  get codigoControl() {
    return this.codigoForm.get('codigo');
  }

  // Transforma el tiempo restante (segundos) al formato minutos:segundos (MM:SS)
  get tiempoFormateado(): string {
    const minutos = Math.floor(this.tiempoRestante / 60); // Obtiene los minutos enteros
    const segundos = this.tiempoRestante % 60; // Obtiene los segundos restantes
    return `${minutos}:${segundos.toString().padStart(2, '0')}`; // Formatea a 2 dígitos
  }

  // Evento de teclado para prevenir que se ingresen caracteres que no sean números
  soloNumeros(event: KeyboardEvent): void {
    // Si la tecla no es un número del 0 al 9, bloquea la acción
    if (!/^[0-9]$/.test(event.key)) {
      event.preventDefault();
    }
  }

  // Limpia y normaliza el valor ingresado en el input del código
  normalizarCodigo(): void {
    this.mensajeReenvio = ''; // Resetea el mensaje de reenvío
    this.limiteReenvioAlcanzado = false; // Resetea el bloqueo
    // Convierte a string, elimina caracteres no numéricos y corta a un máximo de 6 dígitos
    const valor = String(this.codigoControl?.value ?? '')
      .replace(/\D/g, '')
      .slice(0, 6);

    // Actualiza el valor en el formulario sin emitir eventos adicionales para evitar bucles
    this.codigoControl?.setValue(valor, { emitEvent: false });
  }

  // Método ejecutado al intentar verificar el código ingresado
  verificarCodigo(): void {
    // Primero normaliza el código para asegurar que el formato es correcto
    this.normalizarCodigo();

    // Si el formulario es inválido, muestra los errores marcando el campo
    if (this.codigoForm.invalid) {
      this.codigoForm.markAllAsTouched();
      return; // Detiene la ejecución
    }

    // Si todo es válido, notifica al componente padre
    this.codigoVerificado.emit();
  }

  // Lógica para solicitar que se envíe nuevamente el código
  solicitarReenvio(): void {
    // Verifica si las reglas de negocio permiten otro intento de reenvío
    if (AutenticacionValidaciones.puedeReenviarCodigo(this.intentosReenvio)) {
      this.intentosReenvio++; // Incrementa el contador
      this.limiteReenvioAlcanzado = false; // Asegura que no esté bloqueado
      this.detenerCountdown(); // Detiene cualquier cuenta regresiva activa
      // Obtiene el mensaje a mostrar según el intento
      this.mensajeReenvio = AutenticacionValidaciones.getCodigoReenvioMensaje(this.intentosReenvio);
      this.reenviarCodigo.emit(); // Emite la acción al componente padre
      return;
    }

    // Si ya no puede reenviar, bloquea la funcionalidad y arranca la cuenta regresiva
    this.limiteReenvioAlcanzado = true;
    this.iniciarCountdown();
  }

  // Función privada para iniciar el temporizador de bloqueo (cuenta regresiva)
  private iniciarCountdown(): void {
    this.detenerCountdown(); // Limpia temporizadores previos
    this.tiempoRestante = 15 * 60; // Configura el tiempo: 15 minutos en segundos
    
    // Crea un intervalo que se ejecuta cada segundo (1000 ms)
    this.intervaloCountdown = setInterval(() => {
      this.tiempoRestante--; // Resta un segundo
      this.cdr.detectChanges(); // Fuerza a Angular a actualizar la vista para mostrar el nuevo tiempo
      
      // Si el tiempo se agotó
      if (this.tiempoRestante <= 0) {
        this.detenerCountdown(); // Limpia el intervalo
        this.limiteReenvioAlcanzado = false; // Desbloquea el botón de reenvío
        this.mensajeReenvio = ''; // Limpia el mensaje
        this.intentosReenvio = 0; // Reinicia los intentos de reenvío
        this.cdr.detectChanges(); // Actualiza la vista
      }
    }, 1000);
  }

  // Función privada para detener y limpiar la ejecución del temporizador
  private detenerCountdown(): void {
    if (this.intervaloCountdown) {
      clearInterval(this.intervaloCountdown); // Cancela el intervalo activo
      this.intervaloCountdown = null; // Resetea la variable
    }
  }
}
