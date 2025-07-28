import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home').then((m) => m.Home),
  },
  {
    path: 'routine-details/:day',
    loadComponent: () =>
      import('./pages/routine-details/routine-details').then(
        (m) => m.RoutineDetails
      ),
  },
  {
    path: '**',
    redirectTo: 'home',
  },
];
