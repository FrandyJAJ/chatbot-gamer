import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ChatService } from '../services/chat';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth';

interface MensajeChat {
  tipo: 'usuario' | 'bot';
  texto: string;
}

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule
  ],
  templateUrl: './chat.html',
  styleUrl: './chat.css'
})
export class ChatComponent {

  cerrarSesion(): void {
  this.authService.cerrarSesion();
  this.router.navigate(['/login']);
}

  mensaje = '';

  mensajes = signal<MensajeChat[]>([
    {
      tipo: 'bot',
      texto: '¡Hola! 👋 Soy GameBot. Pregúntame por un videojuego.'
    }
  ]);

  enviando = signal(false);

  constructor(private chatService: ChatService, private authService: AuthService,
  private router: Router
  ) {}

  enviar(): void {

    const textoUsuario = this.mensaje.trim();

    if (textoUsuario === '' || this.enviando()) {
      return;
    }

    this.mensajes.update(lista => [
      ...lista,
      {
        tipo: 'usuario',
        texto: textoUsuario
      }
    ]);

    this.mensaje = '';
    this.enviando.set(true);

    this.chatService.enviarMensaje(textoUsuario).subscribe({

      next: (res) => {

        let respuestaBot = '';

        if (res.encontrado && res.juego) {

          const juego = res.juego;

          respuestaBot = `🎮 ${juego.nombre}

⭐ Calificación:
${juego.calificacion}/10

🎯 Género:
${juego.genero}

🏢 Desarrollador:
${juego.desarrollador}

📅 Lanzamiento:
${juego.lanzamiento}

💻 Plataformas:
${juego.plataformas}

📝 Descripción:
${juego.descripcion}`;

        } else {

          respuestaBot =
            res.respuesta ||
            'No pude obtener una respuesta del servidor.';

        }

        this.mensajes.update(lista => [
          ...lista,
          {
            tipo: 'bot',
            texto: respuestaBot
          }
        ]);

        this.enviando.set(false);
      },

      error: (error) => {

        console.error('Error al consultar el backend:', error);

        this.mensajes.update(lista => [
          ...lista,
          {
            tipo: 'bot',
            texto: '❌ No pude comunicarme con el servidor. Verifica que el backend esté iniciado en el puerto 3000.'
          }
        ]);

        this.enviando.set(false);
      }

    });
  }
}