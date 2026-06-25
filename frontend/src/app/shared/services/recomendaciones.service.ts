import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class RecomendacionesService {
    private apiUrl = 'http://localhost:3000/api/agricultor/recomendaciones';

    constructor(private http: HttpClient) { }

    private getHeaders(): HttpHeaders {
        const token = localStorage.getItem('auth_token');
        return new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        });
    }

    // Listar todas las recomendaciones
    listarRecomendaciones(): Observable<any[]> {
        return this.http.get<any>(this.apiUrl, { headers: this.getHeaders() }).pipe(
            map(response => response.recomendaciones || []),
            catchError(this.handleError)
        );
    }

    // Obtener una recomendación por ID
    obtenerRecomendacion(id: string): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() }).pipe(
            map(response => response.recomendacion),
            catchError(this.handleError)
        );
    }

    // Crear nueva recomendación
    crearRecomendacion(recomendacion: any): Observable<any> {
        return this.http.post<any>(this.apiUrl, recomendacion, { headers: this.getHeaders() }).pipe(
            map(response => response.recomendacion),
            catchError(this.handleError)
        );
    }

    // Editar recomendación existente
    editarRecomendacion(id: string, recomendacion: any): Observable<any> {
        return this.http.put<any>(`${this.apiUrl}/${id}`, recomendacion, { headers: this.getHeaders() }).pipe(
            map(response => response.recomendacion),
            catchError(this.handleError)
        );
    }

    // Eliminar recomendación
    eliminarRecomendacion(id: string): Observable<any> {
        return this.http.delete<any>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() }).pipe(
            catchError(this.handleError)
        );
    }

    // Listar recomendaciones por usuario
    listarPorUsuario(usuario_id: string): Observable<any[]> {
        return this.http.get<any>(`${this.apiUrl}/usuario/${usuario_id}`, { headers: this.getHeaders() }).pipe(
            map(response => response.recomendaciones || []),
            catchError(this.handleError)
        );
    }

    private handleError(error: any): Observable<never> {
        let mensaje = 'Error en la conexión con el servidor';

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

        console.error('RecomendacionesService error:', {
            status: error?.status,
            mensaje,
            body: error?.error,
            original: error,
        });

        const errorReal = new Error(mensaje);
        (errorReal as any).status = error?.status ?? null;
        return throwError(() => errorReal);
    }
}
