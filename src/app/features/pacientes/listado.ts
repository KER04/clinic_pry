import { Component } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { PacientesI } from '../../models/pacientes';
import { ButtonModule } from 'primeng/button';
import{ RouterModule } from '@angular/router';

@Component({
  selector: 'app-listado',
  imports: [TableModule, CommonModule, ButtonModule, RouterModule],
  templateUrl: './listado.html',
  styleUrl: './listado.css'
})
export class Listado {
  pacientes: PacientesI[] = [
    {
      id: 1,
      name: 'Juan',
      last_name: 'Perez',
      fechaNacimiento: new Date('1990-01-01'),
      genero: 'Masculino',
      phone: '1234567890',
      email: 'juan@juan.com',
      direccion: 'Calle Falsa 123',
      historialMedico: 'Ninguno',
      status: 'Activo'
    },
    {
      id: 2,
      name: 'Maria',
      last_name: 'Gomez',
      fechaNacimiento: new Date('1985-05-15'),
      genero: 'Femenino',
      phone: '9876543210',
      email: 'maria@gomez.com',
      direccion: 'Av. Siempre Viva 742',
      historialMedico: 'Alergia a penicilina',
      status: 'Activo'
    },
    {
      id: 3,
      name: 'Carlos',
      last_name: 'Ramirez',
      fechaNacimiento: new Date('1978-11-30'),
      genero: 'Masculino',
      phone: '1122334455',
      email: 'carlos@ramirez.com',
      direccion: 'Carrera 45 #12-34',
      historialMedico: 'Hipertensión',
      status: 'Inactivo'
    },
    {
      id: 4,
      name: 'Ana',
      last_name: 'Martinez',
      fechaNacimiento: new Date('1992-07-20'),
      genero: 'Femenino',
      phone: '3344556677',
      email: 'ana@martinez.com',
      direccion: 'Calle Luna 456',
      historialMedico: 'Asma',
      status: 'Activo'
    },
    {
      id: 5,
      name: 'Luis',
      last_name: 'Torres',
      fechaNacimiento: new Date('2000-03-12'),
      genero: 'Masculino',
      phone: '2233445566',
      email: 'luis@torres.com',
      direccion: 'Calle Sol 789',
      historialMedico: 'Diabetes tipo 2',
      status: 'Activo'
    }
  ];
}
