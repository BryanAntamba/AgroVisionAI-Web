import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// Interfaz para el usuario como viene del backend
interface UsuarioBackend {
    id: number;
    nombres: string;
    apellidos: string;
    correo_empresarial: string;
    correo_personal: string;
    telefono: string;
    activo: boolean;
    creado_en: string;
    actualizado_en: string;
    rol: string;
}

// Interfaz para el usuario como lo espera el frontend
export interface UsuarioAdmin {
    id: number;
    nombre: string;
    segundoNombre: string;
    apellido: string;
    segundoApellido: string;
    correoCorporativo: string;
    correoElectronico: string;
    telefono: string;
    rol: 'Admin' | 'Agricultor';
    cuenta: 'Activo' | 'Inactivo';
    sesion: 'En linea' | 'Sin sesion';
    dispositivo?: 'Dispositivo vinculado' | 'Dispositivo no vinculado';
    fechaRegistro: string;
}

@Injectable({
    providedIn: 'root'
})
export class UsuariosService {
    private apiUrl = 'http://localhost:3000/api/admin/usuarios';

    constructor(private http: HttpClient) { }

    /**
     * Obtiene el token de autenticación desde localStorage
     */
    private getToken(): string | null {
        return localStorage.getItem('auth_token');
    }

    /**
     * Crea los headers con el token de autenticación
     */
    private getHeaders(): HttpHeaders {
        const token = this.getToken();
        return new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : ''
        });
    }

    /**
     * Convierte un usuario del formato backend al formato frontend
     */
    private transformarUsuario(usuario: UsuarioBackend): UsuarioAdmin {
        // Dividir nombres en primer y segundo nombre
        const nombres = usuario.nombres.trim().split(' ');
        const nombre = nombres[0] || '';
        const segundoNombre = nombres.slice(1).join(' ') || '';

        // Dividir apellidos en primer y segundo apellido
        const apellidos = usuario.apellidos.trim().split(' ');
        const apellido = apellidos[0] || '';
        const segundoApellido = apellidos.slice(1).join(' ') || '';

        // Normalizar el rol
        let rol: 'Admin' | 'Agricultor' = 'Agricultor';
        if (usuario.rol?.toUpperCase() === 'ADMIN' || usuario.rol?.toUpperCase() === 'ADMINISTRADOR') {
            rol = 'Admin';
        } else if (usuario.rol?.toUpperCase() === 'AGRICULTOR') {
            rol = 'Agricultor';
        }

        // Convertir activo a cuenta
        const cuenta: 'Activo' | 'Inactivo' = usuario.activo ? 'Activo' : 'Inactivo';

        // Formatear fecha de registro (YYYY-MM-DD)
        const fechaRegistro = usuario.creado_en ? usuario.creado_en.split('T')[0] : '';

        return {
            id: usuario.id,
            nombre,
            segundoNombre,
            apellido,
            segundoApellido,
            correoCorporativo: usuario.correo_empresarial || '',
            correoElectronico: usuario.correo_personal || '',
            telefono: usuario.telefono || '',
            rol,
            cuenta,
            sesion: 'Sin sesion', // Por ahora, no hay tracking de sesión en tiempo real
            fechaRegistro
        };
    }

    /**
     * Lista todos los usuarios del sistema
     */
    listarUsuarios(): Observable<UsuarioAdmin[]> {
        return this.http.get<any>(this.apiUrl, { headers: this.getHeaders() }).pipe(
            map(response => {
                if (response.usuarios && Array.isArray(response.usuarios)) {
                    return response.usuarios.map((usuario: UsuarioBackend) =>
                        this.transformarUsuario(usuario)
                    );
                }
                return [];
            })
        );
    }

    /**
     * Obtiene un usuario específico por ID
     */
    obtenerUsuario(id: number): Observable<UsuarioAdmin> {
        return this.http.get<any>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() }).pipe(
            map(response => {
                if (response.usuario) {
                    return this.transformarUsuario(response.usuario);
                }
                throw new Error('Usuario no encontrado');
            })
        );
    }

    /**
     * Registra un nuevo usuario
     */
    registrarUsuario(datos: any): Observable<any> {
        return this.http.post<any>(this.apiUrl, datos, { headers: this.getHeaders() });
    }

    /**
     * Edita un usuario existente
     */
    editarUsuario(id: number, datos: any): Observable<any> {
        return this.http.put<any>(`${this.apiUrl}/${id}`, datos, { headers: this.getHeaders() });
    }

    /**
     * Desactiva un usuario (soft delete)
     */
    desactivarUsuario(id: number): Observable<any> {
        return this.http.patch<any>(`${this.apiUrl}/${id}/estado`, {}, { headers: this.getHeaders() });
    }

    /**
     * Elimina un usuario permanentemente
     */
    eliminarUsuario(id: number): Observable<any> {
        return this.http.delete<any>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
    }

    /**
     * Lista usuarios por rol
     */
    listarPorRol(rolId: number): Observable<UsuarioAdmin[]> {
        return this.http.get<any>(`${this.apiUrl}/rol/${rolId}`, { headers: this.getHeaders() }).pipe(
            map(response => {
                if (response.usuarios && Array.isArray(response.usuarios)) {
                    return response.usuarios.map((usuario: UsuarioBackend) =>
                        this.transformarUsuario(usuario)
                    );
                }
                return [];
            })
        );
    }
}
