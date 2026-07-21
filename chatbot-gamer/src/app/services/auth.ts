import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Usuario {
  id_usuario: number;
  nombre: string;
  correo: string;
  rol: 'ADMIN' | 'USUARIO';
}

export interface RespuestaLogin {
  mensaje: string;
  token: string;
  usuario: Usuario;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private url = 'https://chatbot-gamer-backend.onrender.com/chat';

  constructor(private http: HttpClient) {}

  registrar(datos: {
    nombre: string;
    correo: string;
    password: string;
  }): Observable<any> {

    return this.http.post(
      `${this.url}/registro`,
      datos
    );
  }

  login(datos: {
    correo: string;
    password: string;
  }): Observable<RespuestaLogin> {

    return this.http.post<RespuestaLogin>(
      `${this.url}/login`,
      datos
    );
  }

guardarSesion(
  token: string,
  usuario: Usuario
): void {

  if (typeof window === 'undefined') {
    return;
  }

  localStorage.setItem('token', token);
  localStorage.setItem(
    'usuario',
    JSON.stringify(usuario)
  );
}

obtenerToken(): string | null {

  if (typeof window === 'undefined') {
    return null;
  }

  return localStorage.getItem('token');
}

obtenerUsuario(): Usuario | null {

  if (typeof window === 'undefined') {
    return null;
  }

  const usuario = localStorage.getItem('usuario');

  if (!usuario) {
    return null;
  }

  try {
    return JSON.parse(usuario);
  } catch {
    return null;
  }
}

estaAutenticado(): boolean {
  return this.obtenerToken() !== null;
}

esAdministrador(): boolean {
  return this.obtenerUsuario()?.rol === 'ADMIN';
}

cerrarSesion(): void {

  if (typeof window === 'undefined') {
    return;
  }

  localStorage.removeItem('token');
  localStorage.removeItem('usuario');
}
}