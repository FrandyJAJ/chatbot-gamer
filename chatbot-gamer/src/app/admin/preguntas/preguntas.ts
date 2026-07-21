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
  DatosPregunta,
  PreguntaAdmin
} from '../../services/admin';

import {
  AuthService,
  Usuario
} from '../../services/auth';

@Component({
  selector: 'app-preguntas',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],
  templateUrl: './preguntas.html',
  styleUrl: './preguntas.css'
})
export class Preguntas implements OnInit {

  usuarioActual: Usuario | null;

  preguntas: PreguntaAdmin[] = [];
  preguntasFiltradas: PreguntaAdmin[] = [];

  busqueda = '';
  cargando = true;
  guardando = false;

  mostrarFormulario = false;
  modoEdicion = false;
  idEdicion: number | null = null;

  mensajeError = '';
  mensajeExito = '';

  formulario: DatosPregunta = this.crearFormularioVacio();

  constructor(
    private adminService: AdminService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.usuarioActual = this.authService.obtenerUsuario();
  }

  ngOnInit(): void {
    this.cargarPreguntas();
  }

  crearFormularioVacio(): DatosPregunta {
    return {
      pregunta: '',
      respuesta: '',
      palabras_clave: '',
      estado: 1
    };
  }

  cargarPreguntas(): void {

    this.cargando = true;
    this.mensajeError = '';

    this.adminService.obtenerPreguntas().subscribe({

      next: (respuesta) => {

        this.preguntas = respuesta;
        this.filtrarPreguntas();

        this.cargando = false;
        this.cdr.detectChanges();
      },

      error: (error) => {

        this.cargando = false;

        this.mensajeError =
          error.error?.mensaje ||
          'No se pudieron cargar las preguntas.';

        this.cdr.detectChanges();
      }
    });
  }

  filtrarPreguntas(): void {

    const texto = this.busqueda
      .trim()
      .toLowerCase();

    if (!texto) {
      this.preguntasFiltradas = [...this.preguntas];
      return;
    }

    this.preguntasFiltradas = this.preguntas.filter(
      pregunta =>
        pregunta.pregunta.toLowerCase().includes(texto) ||
        pregunta.respuesta.toLowerCase().includes(texto) ||
        (
          pregunta.palabras_clave || ''
        ).toLowerCase().includes(texto)
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

  editar(pregunta: PreguntaAdmin): void {

    this.formulario = {
      pregunta: pregunta.pregunta,
      respuesta: pregunta.respuesta,
      palabras_clave: pregunta.palabras_clave || '',
      estado: pregunta.estado
    };

    this.idEdicion = pregunta.id_pregunta;
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
      this.formulario.pregunta.trim() &&
      this.formulario.respuesta.trim()
    );
  }

  guardar(): void {

    this.mensajeError = '';
    this.mensajeExito = '';

    if (!this.formularioValido()) {
      this.mensajeError =
        'La pregunta y la respuesta son obligatorias.';
      return;
    }

    this.guardando = true;

    const datos: DatosPregunta = {
      pregunta: this.formulario.pregunta.trim(),
      respuesta: this.formulario.respuesta.trim(),
      palabras_clave:
        this.formulario.palabras_clave.trim(),
      estado: Number(this.formulario.estado)
    };

    if (this.modoEdicion && this.idEdicion !== null) {

      this.adminService
        .editarPregunta(this.idEdicion, datos)
        .subscribe({

          next: (respuesta) => {
            this.procesarGuardadoCorrecto(
              respuesta.mensaje
            );
          },

          error: (error) => {
            this.procesarErrorGuardado(error);
          }
        });

      return;
    }

    this.adminService
      .agregarPregunta(datos)
      .subscribe({

        next: (respuesta) => {
          this.procesarGuardadoCorrecto(
            respuesta.mensaje
          );
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
    this.cargarPreguntas();

    this.cdr.detectChanges();
  }

  procesarErrorGuardado(error: any): void {

    this.guardando = false;

    this.mensajeError =
      error.error?.mensaje ||
      'No se pudo guardar la pregunta.';

    this.cdr.detectChanges();
  }

  eliminar(pregunta: PreguntaAdmin): void {

    const confirmado = confirm(
      `¿Deseas eliminar la pregunta "${pregunta.pregunta}"?`
    );

    if (!confirmado) {
      return;
    }

    this.mensajeError = '';
    this.mensajeExito = '';

    this.adminService
      .eliminarPregunta(pregunta.id_pregunta)
      .subscribe({

        next: (respuesta) => {

          this.mensajeExito = respuesta.mensaje;

          this.preguntas = this.preguntas.filter(
            item =>
              item.id_pregunta !== pregunta.id_pregunta
          );

          this.filtrarPreguntas();
          this.cdr.detectChanges();
        },

        error: (error) => {

          this.mensajeError =
            error.error?.mensaje ||
            'No se pudo eliminar la pregunta.';

          this.cdr.detectChanges();
        }
      });
  }

  obtenerTextoEstado(estado: number): string {
    return estado === 1 ? 'Activa' : 'Inactiva';
  }

  cerrarSesion(): void {

    this.authService.cerrarSesion();
    this.router.navigate(['/login']);
  }
}