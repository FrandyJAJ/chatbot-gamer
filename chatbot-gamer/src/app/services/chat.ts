import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Videojuego } from '../models/videojuego';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private url = 'http://localhost:3000/chat';

  constructor(private http: HttpClient) {}


  enviarMensaje(mensaje: string): Observable<any> {

    return this.http.post<any>(
      this.url,
      {
        mensaje: mensaje
      }
    );

  }

}