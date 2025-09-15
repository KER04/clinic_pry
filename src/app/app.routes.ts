import { Routes } from '@angular/router';
import { Content } from './components/layout/content/content'; // tu home
import { GetallPatients } from './components/patients/getall/getall';
import { CreateCitas } from './components/citas/create/create';
import { GetallCitas } from './components/citas/getall/getall';
import { CreatePatients } from './components/patients/create/create';
import { FormsGetall } from './components/forms/forms-getall/forms-getall';
import { FormsCreate } from './components/forms/forms-create/forms-create';

export const routes: Routes = [
  { path: '', redirectTo: '', pathMatch: 'full' },

  //Rutas de pacientes
  {
    path: "patients/getall",
    component: GetallPatients
  },
  {
    path: "patients/create",
    component: CreatePatients
  },
  //rutas de citas
  {
    path: "citas/create",
    component: CreateCitas
  },
  {
    path: "citas/getall",
    component: GetallCitas
  },
  //rutas forms 
  {
    path: "forms/getall",
    component: FormsGetall
  },
  {
    path: "forms/create",
    component: FormsCreate
  }

]
