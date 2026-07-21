import { Routes } from '@angular/router';

import { Login } from './auth/login/login';
import { Registro } from './auth/registro/registro';
import { ChatComponent } from './chat/chat';
import { Panel } from './admin/panel/panel';

import { authGuard } from './guards/auth-guard';
import { adminGuard } from './guards/admin-guard';

import { Usuarios } from './admin/usuarios/usuarios';
import { Videojuegos } from './admin/videojuegos/videojuegos';

import { Preguntas } from './admin/preguntas/preguntas';
import { Historial } from './admin/historial/historial';

import { Sesiones } from './admin/sesiones/sesiones';

export const routes: Routes = [



  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  {
    path: 'login',
    component: Login
  },

  {
    path: 'registro',
    component: Registro
  },

  {
    path: 'chat',
    component: ChatComponent,
    canActivate: [authGuard]
  },

  {
    path: 'admin',
    component: Panel,
    canActivate: [adminGuard]
  },

      {
  path: 'admin/usuarios',
  component: Usuarios,
  canActivate: [adminGuard]
},

{
  path: 'admin/videojuegos',
  component: Videojuegos,
  canActivate: [adminGuard]
},

{
  path: 'admin/preguntas',
  component: Preguntas,
  canActivate: [adminGuard]
},

{
  path: 'admin/historial',
  component: Historial,
  canActivate: [adminGuard]
},

{
  path:'admin/sesiones',
  component:Sesiones,
  canActivate:[adminGuard]
},

  {
    path: '**',
    redirectTo: 'login'
  }

];