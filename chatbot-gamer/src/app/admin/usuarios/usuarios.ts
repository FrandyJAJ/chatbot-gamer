import {
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import {
  AdminService,
  UsuarioAdmin
} from '../../services/admin';

import {
  AuthService,
  Usuario
} from '../../services/auth';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],
  templateUrl: './usuarios.html',
  styleUrl: './usuarios.css'
})
export class Usuarios implements OnInit {

  usuarioActual: Usuario | null;

  usuarios: UsuarioAdmin[] = [];
  usuariosFiltrados: UsuarioAdmin[] = [];

  busqueda = '';
  cargando = true;
  mensajeError = '';
  mensajeExito = '';

  constructor(
    private adminService: AdminService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.usuarioActual = this.authService.obtenerUsuario();
  }

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios(): void {

    this.cargando = true;
    this.mensajeError = '';
    this.mensajeExito = '';

    this.adminService.obtenerUsuarios().subscribe({

      next: (respuesta) => {

        this.usuarios = respuesta;
        this.usuariosFiltrados = respuesta;

        this.cargando = false;
        this.cdr.detectChanges();
      },

      error: (error) => {

        this.cargando = false;

        this.mensajeError =
          error.error?.mensaje ||
          'No se pudieron cargar los usuarios.';

        this.cdr.detectChanges();
      }
    });
  }

  filtrarUsuarios(): void {

    const texto = this.busqueda
      .trim()
      .toLowerCase();

    if (!texto) {
      this.usuariosFiltrados = this.usuarios;
      return;
    }

    this.usuariosFiltrados = this.usuarios.filter(
      usuario =>
        usuario.nombre.toLowerCase().includes(texto) ||
        usuario.correo.toLowerCase().includes(texto) ||
        usuario.rol.toLowerCase().includes(texto)
    );
  }

  estaActivo(usuario: UsuarioAdmin): boolean {
    return usuario.activo === true || usuario.activo === 1;
  }

  cambiarEstado(usuario: UsuarioAdmin): void {

    const nuevoEstado = !this.estaActivo(usuario);

    const accion = nuevoEstado
      ? 'activar'
      : 'desactivar';

    const confirmado = confirm(
      `¿Deseas ${accion} al usuario ${usuario.nombre}?`
    );

    if (!confirmado) {
      return;
    }

    this.mensajeError = '';
    this.mensajeExito = '';

    this.adminService
      .cambiarEstadoUsuario(
        usuario.id_usuario,
        nuevoEstado
      )
      .subscribe({

        next: (respuesta) => {

          usuario.activo = nuevoEstado;
          this.mensajeExito = respuesta.mensaje;

          this.cdr.detectChanges();
        },

        error: (error) => {

          this.mensajeError =
            error.error?.mensaje ||
            'No se pudo cambiar el estado.';

          this.cdr.detectChanges();
        }
      });
  }

  esUsuarioActual(usuario: UsuarioAdmin): boolean {
    return (
      this.usuarioActual?.id_usuario === usuario.id_usuario
    );
  }

  cerrarSesion(): void {
    this.authService.cerrarSesion();
    this.router.navigate(['/login']);
  }
}