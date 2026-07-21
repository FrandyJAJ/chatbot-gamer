import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Videojuego } from '../models/videojuego';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private url = 'https://chatbot-gamer-backend.onrender.com/chat';

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