// Importaciones de módulos y utilidades de Angular
import { CommonModule } from '@angular/common';
import { Component, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

// Importación de servicio de autenticación
import { AuthService } from '../../shared/services/auth.service';

// Importación de validaciones compartidas
import { ModalesValidaciones } from '../../shared/validators/modales-validaciones';
import { AutenticacionValidaciones } from '../../shared/validators/autenticacion-validaciones';

// Importación del componente hijo de recuperar contraseña
import { RestablecerPassword } from '../restablecer-password/restablecer-password';

// Decorador que define al componente como 'standalone' y especifica dependencias
@Component({
  selector: 'app-login', // Selector HTML
  standalone: true, // Componente independiente (no requiere declararse en un NgModule)
  imports: [CommonModule, ReactiveFormsModule, RestablecerPassword], // Módulos y componentes requeridos
  templateUrl: './login.html', // Plantilla visual
  styleUrls: [ // Hoja de estilos principal y utilitarios compartidos
    './login.css',
    '../../shared/validators/styles/validacion-errores.css',
    '../../shared/validators/styles/animaciones-autenticacion.css'
  ]
})
export class Login {
  // Variable para alternar la visibilidad de la contraseña en el formulario
  showPassword = false;
  // Mensaje de error a mostrar cuando fallan las credenciales
  loginError = '';
  // Indica si hay una petición de login en curso (evita doble envío)
  isLoading = false;
  // Variable para alternar entre la vista de Login y la vista de Restablecer contraseña
  showResetPassword = false;

  // Objeto que representa el formulario y sus controles
  loginForm: FormGroup;
  // Exposición de validaciones para ser usadas en el HTML
  validators = AutenticacionValidaciones;

  // Constructor donde se inyectan el FormBuilder (formularios) y Router (navegación)
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {
    // Inicialización del formulario reactivo
    this.loginForm = this.fb.group({
      // Campo de correo electrónico con validación requerida y formato corporativo @agrovision.com
      email: [
        '',
        [
          Validators.required,
          Validators.pattern(ModalesValidaciones.CORREO_CORPORATIVO_PATTERN)
        ]
      ],
      // Campo de contraseña, requerido
      password: ['', [Validators.required]]
    });
  }

  // Getter auxiliar para acceder al control de correo electrónico fácilmente
  get emailControl() {
    return this.loginForm.get('email');
  }

  // Getter auxiliar para acceder al control de contraseña fácilmente
  get passwordControl() {
    return this.loginForm.get('password');
  }

  // Función para invertir el valor de showPassword, ocultando o revelando el texto
  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  // Función para cambiar a la vista de "Recuperar Contraseña"
  openResetPassword(): void {
    this.showResetPassword = true; // Activa la vista hija
    this.loginError = ''; // Limpia cualquier error anterior
    this.loginForm.markAsUntouched(); // Limpia los estados de validación tocados
  }

  // Función para regresar de la vista de recuperación de contraseña al Login
  backToLogin(): void {
    this.showResetPassword = false; // Vuelve a la vista de login
    this.loginError = ''; // Limpia errores
    this.showPassword = false; // Oculta contraseña
    this.loginForm.reset(); // Resetea los campos del formulario
  }

  // Función principal ejecutada al intentar iniciar sesión
  onSubmit(): void {
    if (this.isLoading) {
      return;
    }

    this.loginError = ''; // Limpia el error previo

    // Verifica si el formulario falla en alguna regla de validación
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched(); // Muestra visualmente los errores
      return; // Interrumpe el proceso
    }

    // Extrae los valores ingresados
    const { email, password } = this.loginForm.value;

    this.isLoading = true;

    // Llamada real al backend
    this.authService.login(email, password).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.cdr.detectChanges();
        if (response?.success) {
          const role = response.usuario?.rol;

          if (role === 'Admin') {
            this.router.navigate(['/panel-admin']);
          } else if (role === 'Agricultor') {
            this.router.navigate(['/panel-agricultor']);
          } else {
            this.router.navigate(['/']);
          }
        } else {
          console.error('Login response failure:', response);
          this.loginError = response?.mensaje || 'Error en el inicio de sesión.';
        }
      },
      error: (err) => {
        console.error('Login request error:', err);
        this.loginError = err?.message || 'Credenciales incorrectas. Verifique el correo y la contraseña.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }
}
