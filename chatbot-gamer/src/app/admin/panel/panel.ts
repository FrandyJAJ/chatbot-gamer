import {
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  Router,
  RouterLink
} from '@angular/router';

import {
  AuthService,
  Usuario
} from '../../services/auth';

import {
  AdminService,
  DashboardRespuesta
} from '../../services/admin';

@Component({
  selector: 'app-panel',
  standalone: true,
  imports: [
  CommonModule,
  RouterLink
],
  templateUrl: './panel.html',
  styleUrl: './panel.css'
})
export class Panel implements OnInit {

  usuario: Usuario | null;

  dashboard: DashboardRespuesta = {
    totales: {
      usuarios: 0,
      videojuegos: 0,
      preguntas: 0,
      historial: 0,
      sesiones: 0
    },
    ultimosUsuarios: [],
    ultimasSesiones: []
  };

  cargando = true;
  mensajeError = '';


  
  constructor(
  private authService: AuthService,
  private adminService: AdminService,
  private router: Router,
  private cdr: ChangeDetectorRef
) {
  this.usuario = this.authService.obtenerUsuario();
}

  ngOnInit(): void {
    this.cargarDashboard();
  }

  cargarDashboard(): void {

    this.cargando = true;
    this.mensajeError = '';

    this.adminService.obtenerDashboard().subscribe({

    next: (respuesta) => {
  console.log('Dashboard recibido:', respuesta);
  

  this.dashboard = {
    totales: respuesta.totales,
    ultimosUsuarios: respuesta.ultimosUsuarios || [],
    ultimasSesiones: respuesta.ultimasSesiones || []
  };

  this.cargando = false;
  this.mensajeError = '';

  this.cdr.detectChanges();

  console.log('Estado cargando:', this.cargando);
  console.log('Datos asignados:', this.dashboard);
},

      error: (error) => {

        console.error(error);

        this.mensajeError =
          error.error?.mensaje ||
          'No se pudo cargar el panel administrativo.';

        this.cargando = false;

        this.cdr.detectChanges();


        if (error.status === 401 || error.status === 403) {
          this.authService.cerrarSesion();
          this.router.navigate(['/login']);
        }
      }

    });
  }

  cerrarSesion(): void {

    this.authService.cerrarSesion();
    this.router.navigate(['/login']);
  }
}