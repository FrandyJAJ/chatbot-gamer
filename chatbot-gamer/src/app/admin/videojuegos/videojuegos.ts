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
  DatosVideojuego,
  VideojuegoAdmin
} from '../../services/admin';

import {
  AuthService,
  Usuario
} from '../../services/auth';

@Component({
  selector: 'app-videojuegos',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],
  templateUrl: './videojuegos.html',
  styleUrl: './videojuegos.css'
})
export class Videojuegos implements OnInit {

  usuarioActual: Usuario | null;

  videojuegos: VideojuegoAdmin[] = [];
  videojuegosFiltrados: VideojuegoAdmin[] = [];

  busqueda = '';
  cargando = true;
  guardando = false;

  mostrarFormulario = false;
  modoEdicion = false;
  idEdicion: number | null = null;

  mensajeError = '';
  mensajeExito = '';

  formulario: DatosVideojuego = this.crearFormularioVacio();

  constructor(
    private adminService: AdminService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.usuarioActual = this.authService.obtenerUsuario();
  }

  ngOnInit(): void {
    this.cargarVideojuegos();
  }

  crearFormularioVacio(): DatosVideojuego {
    return {
      nombre: '',
      genero: '',
      desarrollador: '',
      editor: '',
      lanzamiento: null,
      plataformas: '',
      motor: '',
      modo: '',
      clasificacion: '',
      calificacion: null,
      descripcion: '',
      imagen: ''
    };
  }

  cargarVideojuegos(): void {

    this.cargando = true;
    this.mensajeError = '';

    this.adminService.obtenerVideojuegos().subscribe({

      next: (respuesta) => {

        this.videojuegos = respuesta;
        this.filtrarVideojuegos();

        this.cargando = false;
        this.cdr.detectChanges();
      },

      error: (error) => {

        this.cargando = false;

        this.mensajeError =
          error.error?.mensaje ||
          'No se pudieron cargar los videojuegos.';

        this.cdr.detectChanges();
      }
    });
  }

  filtrarVideojuegos(): void {

    const texto = this.busqueda
      .trim()
      .toLowerCase();

    if (!texto) {
      this.videojuegosFiltrados = [...this.videojuegos];
      return;
    }

    this.videojuegosFiltrados = this.videojuegos.filter(
      videojuego =>
        videojuego.nombre.toLowerCase().includes(texto) ||
        videojuego.genero.toLowerCase().includes(texto) ||
        videojuego.desarrollador.toLowerCase().includes(texto)
    );
  }

  abrirFormularioNuevo(): void {

    this.formulario = this.crearFormularioVacio();

    this.idEdicion = null;
    this.modoEdicion = false;
    this.mostrarFormulario = true;

    this.mensajeError = '';
    this.mensajeExito = '';
  }

  editar(videojuego: VideojuegoAdmin): void {

    this.formulario = {
      nombre: videojuego.nombre,
      genero: videojuego.genero,
      desarrollador: videojuego.desarrollador,
      editor: videojuego.editor || '',
      lanzamiento: videojuego.lanzamiento,
      plataformas: videojuego.plataformas,
      motor: videojuego.motor || '',
      modo: videojuego.modo || '',
      clasificacion: videojuego.clasificacion || '',
      calificacion: videojuego.calificacion,
      descripcion: videojuego.descripcion,
      imagen: videojuego.imagen || ''
    };

    this.idEdicion = videojuego.id;
    this.modoEdicion = true;
    this.mostrarFormulario = true;

    this.mensajeError = '';
    this.mensajeExito = '';

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  cancelarFormulario(): void {

    this.mostrarFormulario = false;
    this.modoEdicion = false;
    this.idEdicion = null;

    this.formulario = this.crearFormularioVacio();
  }

  formularioValido(): boolean {

    return Boolean(
      this.formulario.nombre.trim() &&
      this.formulario.genero.trim() &&
      this.formulario.desarrollador.trim() &&
      this.formulario.lanzamiento &&
      this.formulario.plataformas.trim() &&
      this.formulario.descripcion.trim()
    );
  }

  guardar(): void {

    this.mensajeError = '';
    this.mensajeExito = '';

    if (!this.formularioValido()) {
      this.mensajeError =
        'Completa todos los campos obligatorios.';
      return;
    }

    if (
      this.formulario.calificacion !== null &&
      (
        this.formulario.calificacion < 0 ||
        this.formulario.calificacion > 10
      )
    ) {
      this.mensajeError =
        'La calificación debe estar entre 0 y 10.';
      return;
    }

    this.guardando = true;

    const datos: DatosVideojuego = {
      ...this.formulario,
      nombre: this.formulario.nombre.trim(),
      genero: this.formulario.genero.trim(),
      desarrollador: this.formulario.desarrollador.trim(),
      editor: this.formulario.editor.trim(),
      plataformas: this.formulario.plataformas.trim(),
      motor: this.formulario.motor.trim(),
      modo: this.formulario.modo.trim(),
      clasificacion: this.formulario.clasificacion.trim(),
      descripcion: this.formulario.descripcion.trim(),
      imagen: this.formulario.imagen.trim()
    };

    if (this.modoEdicion && this.idEdicion !== null) {

      this.adminService
        .editarVideojuego(this.idEdicion, datos)
        .subscribe({

          next: (respuesta) => {
            this.procesarGuardadoCorrecto(respuesta.mensaje);
          },

          error: (error) => {
            this.procesarErrorGuardado(error);
          }
        });

      return;
    }

    this.adminService
      .agregarVideojuego(datos)
      .subscribe({

        next: (respuesta) => {
          this.procesarGuardadoCorrecto(respuesta.mensaje);
        },

        error: (error) => {
          this.procesarErrorGuardado(error);
        }
      });
  }

  procesarGuardadoCorrecto(mensaje: string): void {

    this.guardando = false;
    this.mensajeExito = mensaje;

    this.cancelarFormulario();
    this.cargarVideojuegos();

    this.cdr.detectChanges();
  }

  procesarErrorGuardado(error: any): void {

    this.guardando = false;

    this.mensajeError =
      error.error?.mensaje ||
      'No se pudo guardar el videojuego.';

    this.cdr.detectChanges();
  }

  eliminar(videojuego: VideojuegoAdmin): void {

    const confirmado = confirm(
      `¿Deseas eliminar el videojuego "${videojuego.nombre}"?`
    );

    if (!confirmado) {
      return;
    }

    this.mensajeError = '';
    this.mensajeExito = '';

    this.adminService
      .eliminarVideojuego(videojuego.id)
      .subscribe({

        next: (respuesta) => {

          this.mensajeExito = respuesta.mensaje;

          this.videojuegos = this.videojuegos.filter(
            item => item.id !== videojuego.id
          );

          this.filtrarVideojuegos();
          this.cdr.detectChanges();
        },

        error: (error) => {

          this.mensajeError =
            error.error?.mensaje ||
            'No se pudo eliminar el videojuego.';

          this.cdr.detectChanges();
        }
      });
  }

  cerrarSesion(): void {

    this.authService.cerrarSesion();
    this.router.navigate(['/login']);
  }
}