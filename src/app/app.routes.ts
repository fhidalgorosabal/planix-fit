import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home').then((c) => c.Home),
  },
  {
    path: 'routine-details/:day',
    loadComponent: () =>
      import('./pages/routine-details/routine-details').then(
        (c) => c.RoutineDetails
      ),
  },
  {
    path: 'routine-setup',
    loadComponent: () =>
      import('./pages/routine-setup/routine-setup').then((c) => c.RoutineSetup),
  },
  {
    path: '**',
    redirectTo: 'home',
  },
];
