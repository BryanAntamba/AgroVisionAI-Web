// Importa módulos comunes y de núcleo de Angular, incluyendo OnDestroy y ChangeDetectorRef
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, OnDestroy, ChangeDetectorRef } from '@angular/core';
// Importa herramientas para formularios reactivos
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
// Importa validadores de patrones
import { ModalesValidaciones } from '../../shared/validators/modales-validaciones';
// Importa reglas de validación de autenticación
import { AutenticacionValidaciones } from '../../shared/validators/autenticacion-validaciones';
// Importa servicio para validar el código en el backend
import { AuthService } from '../../shared/services/auth.service';

// Decorador del componente con sus metadatos
@Component({
  selector: 'app-codigo-verificacion',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './codigo-verificacion.html',
  styleUrls: [
    './codigo-verificacion.css',
    '../../shared/validators/styles/validacion-errores.css',
    '../../shared/validators/styles/animaciones-autenticacion.css'
  ],
})
export class CodigoVerificacion implements OnDestroy {
  @Input() correo = '';
  @Output() codigoVerificado = new EventEmitter<void>();
  @Output() reenviarCodigo = new EventEmitter<void>();

  codigoForm: FormGroup;
  mensajeReenvio = '';
  intentosReenvio = 0;
  limiteReenvioAlcanzado = false;
  codigoReenviadoExitosamente = false;
  validators = AutenticacionValidaciones;
  codigoError = '';
  tiempoRestante = 0;
  intervaloCountdown: ReturnType<typeof setInterval> | null = null;
  isLoading = false;
  private readonly COOLDOWN_SECONDS = 60;

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private authService: AuthService
  ) {
    this.codigoForm = this.fb.group({
      codigo: ['', [Validators.required, Validators.pattern(ModalesValidaciones.CODIGO_VERIFICACION_PATTERN)]],
    });
  }

  ngOnDestroy(): void {
    this.detenerCountdown();
  }

  get codigoControl() {
    return this.codigoForm.get('codigo');
  }

  get tiempoFormateado(): string {
    const minutos = Math.floor(this.tiempoRestante / 60);
    const segundos = this.tiempoRestante % 60;
    return `${minutos}:${segundos.toString().padStart(2, '0')}`;
  }

  soloNumeros(event: KeyboardEvent): void {
    if (!/^[0-9]$/.test(event.key)) {
      event.preventDefault();
    }
  }

  normalizarCodigo(): void {
    this.codigoError = '';
    this.mensajeReenvio = '';
    this.limiteReenvioAlcanzado = false;
    const valor = String(this.codigoControl?.value ?? '').replace(/\D/g, '').slice(0, 6);
    this.codigoControl?.setValue(valor, { emitEvent: false });
  }

  verificarCodigo(): void {
    if (this.isLoading) {
      return;
    }

    this.normalizarCodigo();

    if (this.codigoForm.invalid) {
      this.codigoForm.markAllAsTouched();
      return;
    }

    const codigo = this.codigoControl?.value;
    if (!this.correo) {
      this.codigoError = 'Correo inválido para verificar el código.';
      return;
    }

    this.isLoading = true;

    this.authService.verifyCode(this.correo, codigo).subscribe({
      next: () => {
        this.codigoError = '';
        this.isLoading = false;
        this.cdr.detectChanges();
        this.codigoVerificado.emit();
      },
      error: (err) => {
        this.codigoError = err?.message || 'El código no es válido o ha expirado.';
        this.isLoading = false;
        this.cdr.detectChanges();
      },
    });
  }

  solicitarReenvio(): void {
    // Verificar límite de reintentos antes de continuar
    if (!AutenticacionValidaciones.puedeReenviarCodigo(this.intentosReenvio)) {
      this.mensajeReenvio = AutenticacionValidaciones.getCodigoReenvioMensaje(this.intentosReenvio + 1);
      return;
    }

    // Emitir evento al padre para que llame al backend
    // El countdown se iniciará cuando el backend responda exitosamente
    this.reenviarCodigo.emit();
  }

  // Método público para que el padre notifique el resultado del reenvío
  public manejarResultadoReenvio(exitoso: boolean, mensaje?: string): void {
    if (exitoso) {
      this.intentosReenvio++;
      this.limiteReenvioAlcanzado = true;
      this.codigoReenviadoExitosamente = true;
      this.tiempoRestante = this.COOLDOWN_SECONDS;
      this.iniciarCountdown();
      this.mensajeReenvio = 'Código reenviado correctamente a tu correo';
    } else {
      // Si falló, intentar extraer el tiempo de espera del mensaje del backend
      const mensajeError = mensaje || 'No se pudo reenviar el código';
      
      // Buscar patrón "Espera X segundos" en el mensaje
      const match = mensajeError.match(/Espera (\d+) segundo/i);
      if (match && match[1]) {
        const segundos = parseInt(match[1], 10);
        this.limiteReenvioAlcanzado = true;
        this.codigoReenviadoExitosamente = false;
        this.tiempoRestante = segundos;
        this.iniciarCountdown();
        this.mensajeReenvio = 'Ya se envió un código recientemente';
      } else {
        // Si no hay tiempo de espera en el mensaje, solo mostrarlo
        this.mensajeReenvio = mensajeError;
        this.limiteReenvioAlcanzado = false;
        this.codigoReenviadoExitosamente = false;
      }
    }
    this.cdr.detectChanges();
  }

  private iniciarCountdown(): void {
    this.detenerCountdown();
    if (this.tiempoRestante <= 0) {
      this.tiempoRestante = this.COOLDOWN_SECONDS;
    }
    this.intervaloCountdown = setInterval(() => {
      this.tiempoRestante--;
      this.cdr.detectChanges();

      if (this.tiempoRestante <= 0) {
        this.detenerCountdown();
        this.limiteReenvioAlcanzado = false;
        this.mensajeReenvio = '';
        this.cdr.detectChanges();
      }
    }, 1000);
  }

  private detenerCountdown(): void {
    if (this.intervaloCountdown) {
      clearInterval(this.intervaloCountdown);
      this.intervaloCountdown = null;
    }
  }
}
