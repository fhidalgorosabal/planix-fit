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
    path: 'routine-details-setup/:day',
    loadComponent: () =>
      import('./pages/routine-details-setup/routine-details-setup').then(
        (c) => c.RoutineDetailsSetup
      ),
  },
  {
    path: '**',
    redirectTo: 'home',
  },
];
