import { Routes } from '@angular/router';
import { Content } from './components/layout/content/content'; // tu home

export const routes: Routes = [
  // Home
  { path: '', component: Content }, // ⬅️ Home: aquí se muestra Content

  // Citas
  { path: 'citas/listado',  
    loadComponent: () => import('./features/citas/listado').then(m => m.Listado) },
  { path: 'citas/nueva',    
    loadComponent: () => import('./features/citas/nueva').then(m => m.Nueva) },

  // Pacientes
  { path: 'pacientes',         loadComponent: () => import('./features/pacientes/listado').then(m => m.Listado) },
  { path: 'pacientes/nuevo',   loadComponent: () => import('./features/pacientes/nuevo').then(m => m.Nuevo) },
  

  // … agrega las demás rutas cuando las vayas creando
  { path: '**', redirectTo: '' } // fallback
];
