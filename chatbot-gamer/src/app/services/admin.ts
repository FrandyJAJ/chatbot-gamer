import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AuthService } from './auth';

export interface TotalesDashboard {
  usuarios: number;
  videojuegos: number;
  preguntas: number;
  historial: number;
  sesiones: number;
}

export interface UsuarioDashboard {
  id_usuario: number;
  nombre: string;
  correo: string;
  rol: string;
  fecha_registro: string;
}

export interface SesionDashboard {
  id_inicio: number;
  nombre: string;
  correo: string;
  fecha_ingreso: string;
  direccion_ip: string;
  dispositivo: string;
}

export interface DashboardRespuesta {
  totales: TotalesDashboard;
  ultimosUsuarios: UsuarioDashboard[];
  ultimasSesiones: SesionDashboard[];
}

export interface UsuarioAdmin {
  id_usuario: number;
  nombre: string;
  correo: string;
  rol: 'ADMIN' | 'USUARIO';
  activo: number | boolean;
  fecha_registro: string;
}

export interface VideojuegoAdmin {
  id: number;
  nombre: string;
  genero: string;
  desarrollador: string;
  editor: string | null;
  lanzamiento: number;
  plataformas: string;
  motor: string | null;
  modo: string | null;
  clasificacion: string | null;
  calificacion: number | null;
  descripcion: string;
  imagen: string | null;
}

export interface PreguntaAdmin {
  id_pregunta: number;
  pregunta: string;
  respuesta: string;
  palabras_clave: string | null;
  estado: number;
  fecha_creacion: string;
}

export interface DatosPregunta {
  pregunta: string;
  respuesta: string;
  palabras_clave: string;
  estado: number;
}

export interface DatosVideojuego {
  nombre: string;
  genero: string;
  desarrollador: string;
  editor: string;
  lanzamiento: number | null;
  plataformas: string;
  motor: string;
  modo: string;
  clasificacion: string;
  calificacion: number | null;
  descripcion: string;
  imagen: string;
}

export interface HistorialAdmin {
  id: number;
  pregunta: string;
  respuesta: string | null;
  fecha: string;
}

export interface SesionAdmin {
  id_inicio: number;
  id_usuario: number;
  nombre: string;
  correo: string;
  fecha_ingreso: string;
  direccion_ip: string;
  dispositivo: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private url = 'http://localhost:3000/admin';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private obtenerHeaders(): HttpHeaders {

    const token = this.authService.obtenerToken();

    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  obtenerDashboard(): Observable<DashboardRespuesta> {

    return this.http.get<DashboardRespuesta>(
      `${this.url}/dashboard`,
      {
        headers: this.obtenerHeaders()
      }
    );
  }

  // 👇 PÉGALO AQUÍ
  obtenerUsuarios(): Observable<UsuarioAdmin[]> {

    return this.http.get<UsuarioAdmin[]>(
      `${this.url}/usuarios`,
      {
        headers: this.obtenerHeaders()
      }
    );
  }

  obtenerPreguntas(): Observable<PreguntaAdmin[]> {

  return this.http.get<PreguntaAdmin[]>(
    `${this.url}/preguntas`,
    {
      headers: this.obtenerHeaders()
    }
  );
}

obtenerHistorial(): Observable<HistorialAdmin[]> {

  return this.http.get<HistorialAdmin[]>(
    `${this.url}/historial`,
    {
      headers: this.obtenerHeaders()
    }
  );
}

eliminarHistorial(id:number){

  return this.http.delete<{mensaje:string}>(
    `${this.url}/historial/${id}`,
    {
      headers:this.obtenerHeaders()
    }
  );
}

agregarPregunta(
  datos: DatosPregunta
): Observable<{ mensaje: string; id: number }> {

  return this.http.post<{ mensaje: string; id: number }>(
    `${this.url}/preguntas`,
    datos,
    {
      headers: this.obtenerHeaders()
    }
  );
}

editarPregunta(
  id: number,
  datos: DatosPregunta
): Observable<{ mensaje: string }> {

  return this.http.put<{ mensaje: string }>(
    `${this.url}/preguntas/${id}`,
    datos,
    {
      headers: this.obtenerHeaders()
    }
  );
}

eliminarPregunta(
  id: number
): Observable<{ mensaje: string }> {

  return this.http.delete<{ mensaje: string }>(
    `${this.url}/preguntas/${id}`,
    {
      headers: this.obtenerHeaders()
    }
  );
}

  // 👇 Y DESPUÉS ESTE OTRO
  cambiarEstadoUsuario(
    idUsuario: number,
    activo: boolean
  ): Observable<{ mensaje: string }> {

    return this.http.patch<{ mensaje: string }>(
      `${this.url}/usuarios/${idUsuario}/estado`,
      { activo },
      {
        headers: this.obtenerHeaders()
      }
    );
  }

  obtenerVideojuegos(): Observable<VideojuegoAdmin[]> {

  return this.http.get<VideojuegoAdmin[]>(
    `${this.url}/videojuegos`,
    {
      headers: this.obtenerHeaders()
    }
  );
}

agregarVideojuego(
  datos: DatosVideojuego
): Observable<{ mensaje: string; id: number }> {

  return this.http.post<{ mensaje: string; id: number }>(
    `${this.url}/videojuegos`,
    datos,
    {
      headers: this.obtenerHeaders()
    }
  );
}

editarVideojuego(
  id: number,
  datos: DatosVideojuego
): Observable<{ mensaje: string }> {

  return this.http.put<{ mensaje: string }>(
    `${this.url}/videojuegos/${id}`,
    datos,
    {
      headers: this.obtenerHeaders()
    }
  );
}

eliminarVideojuego(
  id: number
): Observable<{ mensaje: string }> {

  return this.http.delete<{ mensaje: string }>(
    `${this.url}/videojuegos/${id}`,
    {
      headers: this.obtenerHeaders()
    }
  );
}

obtenerSesiones() {

  return this.http.get<SesionAdmin[]>(
    `${this.url}/sesiones`,
    {
      headers: this.obtenerHeaders()
    }
  );

}

eliminarSesion(id:number){

  return this.http.delete<{mensaje:string}>(
    `${this.url}/sesiones/${id}`,
    {
      headers:this.obtenerHeaders()
    }
  );

}

}


