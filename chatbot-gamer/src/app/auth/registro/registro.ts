import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],
  templateUrl: './registro.html',
  styleUrl: './registro.css'
})
export class Registro {

  nombre = '';
  correo = '';
  password = '';
  confirmarPassword = '';

  mensajeError = '';
  mensajeExito = '';
  cargando = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  registrar(): void {

    this.mensajeError = '';
    this.mensajeExito = '';

    if (
      !this.nombre.trim() ||
      !this.correo.trim() ||
      !this.password ||
      !this.confirmarPassword
    ) {
      this.mensajeError =
        'Todos los campos son obligatorios.';
      return;
    }

    if (this.password.length < 6) {
      this.mensajeError =
        'La contraseña debe tener al menos 6 caracteres.';
      return;
    }

    if (this.password !== this.confirmarPassword) {
      this.mensajeError =
        'Las contraseñas no coinciden.';
      return;
    }

    this.cargando = true;

    this.authService.registrar({
      nombre: this.nombre.trim(),
      correo: this.correo.trim(),
      password: this.password
    }).subscribe({

      next: () => {

        this.cargando = false;

        this.mensajeExito =
          'Cuenta creada correctamente. Redirigiendo...';

        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1200);
      },

      error: (error) => {

        this.cargando = false;

        this.mensajeError =
          error.error?.mensaje ||
          'No se pudo crear la cuenta.';
      }

    });
  }
}