import { inject } from '@angular/core';
import {
  CanActivateFn,
  Router
} from '@angular/router';

import { AuthService } from '../services/auth';

export const adminGuard: CanActivateFn = () => {

  const authService = inject(AuthService);
  const router = inject(Router);

  if (
    authService.estaAutenticado() &&
    authService.esAdministrador()
  ) {
    return true;
  }

  if (authService.estaAutenticado()) {
    return router.createUrlTree(['/chat']);
  }

  return router.createUrlTree(['/login']);
};