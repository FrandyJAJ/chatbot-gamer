import {
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  Router,
  RouterLink
} from '@angular/router';

import {
  AdminService,
  SesionAdmin
} from '../../services/admin';

import {
  AuthService,
  Usuario
} from '../../services/auth';

@Component({
  selector: 'app-sesiones',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],
  templateUrl: './sesiones.html',
  styleUrl: './sesiones.css'
})
export class Sesiones implements OnInit {

  usuarioActual: Usuario | null;

  sesiones: SesionAdmin[] = [];
  sesionesFiltradas: SesionAdmin[] = [];

  busqueda = '';
  cargando = true;

  mensajeError = '';
  mensajeExito = '';

  sesionSeleccionada: SesionAdmin | null = null;

  constructor(
    private adminService: AdminService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.usuarioActual = this.authService.obtenerUsuario();
  }

  ngOnInit(): void {
    this.cargarSesiones();
  }

  cargarSesiones(): void {

    this.cargando = true;
    this.mensajeError = '';

    this.adminService.obtenerSesiones().subscribe({

      next: (respuesta) => {

        this.sesiones = respuesta;
        this.filtrarSesiones();

        this.cargando = false;
        this.cdr.detectChanges();
      },

      error: (error) => {

        this.cargando = false;

        this.mensajeError =
          error.error?.mensaje ||
          'No se pudieron cargar las sesiones.';

        this.cdr.detectChanges();
      }
    });
  }

  filtrarSesiones(): void {

    const texto = this.busqueda
      .trim()
      .toLowerCase();

    if (!texto) {
      this.sesionesFiltradas = [...this.sesiones];
      return;
    }

    this.sesionesFiltradas = this.sesiones.filter(
      sesion =>
        sesion.nombre.toLowerCase().includes(texto) ||
        sesion.correo.toLowerCase().includes(texto) ||
        sesion.direccion_ip.toLowerCase().includes(texto) ||
        sesion.dispositivo.toLowerCase().includes(texto)
    );
  }

  verDetalle(sesion: SesionAdmin): void {
    this.sesionSeleccionada = sesion;
  }

  cerrarDetalle(): void {
    this.sesionSeleccionada = null;
  }

  eliminar(sesion: SesionAdmin): void {

    const confirmado = confirm(
      `¿Deseas eliminar la sesión de "${sesion.nombre}"?`
    );

    if (!confirmado) {
      return;
    }

    this.mensajeError = '';
    this.mensajeExito = '';

    this.adminService
      .eliminarSesion(sesion.id_inicio)
      .subscribe({

        next: (respuesta) => {

          this.mensajeExito = respuesta.mensaje;

          this.sesiones = this.sesiones.filter(
            item => item.id_inicio !== sesion.id_inicio
          );

          this.filtrarSesiones();
          this.cdr.detectChanges();
        },

        error: (error) => {

          this.mensajeError =
            error.error?.mensaje ||
            'No se pudo eliminar la sesión.';

          this.cdr.detectChanges();
        }
      });
  }

  formatearFecha(fecha: string): string {

    if (!fecha) {
      return 'Sin fecha';
    }

    const fechaConvertida = new Date(fecha);

    if (Number.isNaN(fechaConvertida.getTime())) {
      return fecha;
    }

    return fechaConvertida.toLocaleString('es-EC', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  cerrarSesion(): void {

    this.authService.cerrarSesion();
    this.router.navigate(['/login']);
  }
}