import { Component } from '@angular/core';
import { patientsI } from '../../../models/patients';
import { ButtonModule } from 'primeng/button';
import { RouterModule } from '@angular/router';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { PatientsLocalService } from '../../../services/patients.services';
@Component({
  selector: 'app-getall',
  imports: [TableModule, CommonModule, ButtonModule, RouterModule],
  standalone: true,
  templateUrl: './getall.html',
  styleUrl: './getall.css'
})
export class GetallPatients {
  patients: patientsI[] = [];

  constructor(private patientsSrv: PatientsLocalService) {} // 👈 aquí
  ngOnInit(): void {
    this.patientsSrv.getAll$().subscribe(data => this.patients = data); // ← listo para tu p-table
  }
}
