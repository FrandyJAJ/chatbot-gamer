import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  correo = '';
  password = '';

  mensajeError = '';
  cargando = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  iniciarSesion(): void {

    this.mensajeError = '';

    if (!this.correo.trim() || !this.password.trim()) {
      this.mensajeError =
        'Debes ingresar el correo y la contraseña.';
      return;
    }

    this.cargando = true;

    this.authService.login({
      correo: this.correo.trim(),
      password: this.password
    }).subscribe({

      next: (respuesta) => {

        this.authService.guardarSesion(
          respuesta.token,
          respuesta.usuario
        );

        this.cargando = false;

        if (respuesta.usuario.rol === 'ADMIN') {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/chat']);
        }
      },

      error: (error) => {

        this.cargando = false;

        this.mensajeError =
          error.error?.mensaje ||
          'No se pudo iniciar sesión. Revisa los datos.';
      }

    });
  }
}