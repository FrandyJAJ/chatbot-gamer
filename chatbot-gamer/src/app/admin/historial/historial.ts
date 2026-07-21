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
  HistorialAdmin
} from '../../services/admin';

import {
  AuthService,
  Usuario
} from '../../services/auth';

@Component({
  selector: 'app-historial',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],
  templateUrl: './historial.html',
  styleUrl: './historial.css'
})
export class Historial implements OnInit {

  usuarioActual: Usuario | null;

  historial: HistorialAdmin[] = [];
  historialFiltrado: HistorialAdmin[] = [];

  busqueda = '';
  cargando = true;

  mensajeError = '';
  mensajeExito = '';

  respuestaSeleccionada: HistorialAdmin | null = null;

  constructor(
    private adminService: AdminService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.usuarioActual = this.authService.obtenerUsuario();
  }

  ngOnInit(): void {
    this.cargarHistorial();
  }

  cargarHistorial(): void {

    this.cargando = true;
    this.mensajeError = '';

    this.adminService.obtenerHistorial().subscribe({

      next: (respuesta) => {

        this.historial = respuesta;
        this.filtrarHistorial();

        this.cargando = false;
        this.cdr.detectChanges();
      },

      error: (error) => {

        this.cargando = false;

        this.mensajeError =
          error.error?.mensaje ||
          'No se pudo cargar el historial.';

        this.cdr.detectChanges();
      }
    });
  }

  filtrarHistorial(): void {

    const texto = this.busqueda
      .trim()
      .toLowerCase();

    if (!texto) {
      this.historialFiltrado = [...this.historial];
      return;
    }

    this.historialFiltrado = this.historial.filter(
      registro =>
        registro.pregunta.toLowerCase().includes(texto) ||
        (
          registro.respuesta || ''
        ).toLowerCase().includes(texto)
    );
  }

  verRespuesta(registro: HistorialAdmin): void {
    this.respuestaSeleccionada = registro;
  }

  cerrarRespuesta(): void {
    this.respuestaSeleccionada = null;
  }

  eliminar(registro: HistorialAdmin): void {

    const confirmado = confirm(
      `¿Deseas eliminar la consulta "${registro.pregunta}" del historial?`
    );

    if (!confirmado) {
      return;
    }

    this.mensajeError = '';
    this.mensajeExito = '';

    this.adminService
      .eliminarHistorial(registro.id)
      .subscribe({

        next: (respuesta) => {

          this.mensajeExito = respuesta.mensaje;

          this.historial = this.historial.filter(
            item => item.id !== registro.id
          );

          this.filtrarHistorial();
          this.cdr.detectChanges();
        },

        error: (error) => {

          this.mensajeError =
            error.error?.mensaje ||
            'No se pudo eliminar el registro.';

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