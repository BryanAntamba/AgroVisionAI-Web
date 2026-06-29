import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private tokenSubject = new BehaviorSubject<string | null>(this.getStoredToken());
  private userSubject = new BehaviorSubject<any>(this.getStoredUser());

  token$ = this.tokenSubject.asObservable();
  user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) {}

  private getStoredToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  private getStoredUser(): any {
    const user = localStorage.getItem('auth_user');
    return user ? JSON.parse(user) : null;
  }

  private saveAuth(token: string, user: any): void {
    localStorage.setItem('auth_token', token);
    localStorage.setItem('auth_user', JSON.stringify(user));
    this.tokenSubject.next(token);
    this.userSubject.next(user);
  }

  logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    this.tokenSubject.next(null);
    this.userSubject.next(null);
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap((response) => {
        if (response?.success && response?.token) {
          this.saveAuth(response.token, response.usuario);
        }
      }),
      catchError(this.handleError)
    );
  }

  requestPasswordReset(email: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/request-password-reset`, { email }).pipe(
      catchError(this.handleError)
    );
  }

  verifyCode(email: string, codigo: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/verify-code`, { email, codigo }).pipe(
      catchError(this.handleError)
    );
  }

  changePassword(email: string, newPassword: string, confirmPassword: string): Observable<any> {
    console.log('AuthService.changePassword request:', {
      url: `${this.apiUrl}/change-password`,
      email,
      newPasswordLength: newPassword?.length,
      confirmPasswordLength: confirmPassword?.length,
    });

    return this.http.post<any>(`${this.apiUrl}/change-password`, {
      email,
      newPassword,
      confirmPassword
    }).pipe(
      catchError((error) => {
        console.error('AuthService.changePassword HTTP error:', error);
        return this.handleError(error);
      })
    );
  }

  resendCode(email: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/resend-code`, { email }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any): Observable<never> {
    let mensaje = 'Error en la conexión';
    if (error?.error?.mensaje) {
      mensaje = error.error.mensaje;
    } else if (error?.error?.message) {
      mensaje = error.error.message;
    } else if (error?.message) {
      mensaje = error.message;
    }

    if (error?.status === 0) {
      mensaje = 'No se puede conectar con el servidor. Verifica que el backend esté en marcha.';
    }

    console.error('AuthService error:', {
      status: error?.status,
      mensaje,
      body: error?.error,
      original: error,
    });

    // Lanzamos un Error real (no un objeto plano {mensaje, status}).
    // Con provideBrowserGlobalErrorListeners() activo, un objeto plano
    // viajando por el observable rompe la detección de cambios de Angular,
    // dejando la pantalla "congelada" aunque el error sí llegó.
    const errorReal = new Error(mensaje);
    (errorReal as any).status = error?.status ?? null;
    return throwError(() => errorReal);
  }
}
