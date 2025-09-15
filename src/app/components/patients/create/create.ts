import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { patientsI } from '../../../models/patients';
import { PatientsLocalService } from '../../../services/patients.services';

// PrimeNG
// PrimeNG (compatibles)
import { InputTextModule } from 'primeng/inputtext';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    DatePickerModule,
    SelectModule,
    TextareaModule,
    ButtonModule,
    CardModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './create.html',
  styleUrl: './create.css'
})
export class CreatePatients {

  patients: patientsI[] = [];

  constructor(private patientsSrv: PatientsLocalService) { } // 👈 aquí

  private fb = inject(FormBuilder);
  private service = inject(PatientsLocalService);
  private router = inject(Router);
  private toast = inject(MessageService);




  // ✅ Ahora como objetos {label, value}
  generos = [
    { label: 'Masculino', value: 'Masculino' as const },
    { label: 'Femenino', value: 'Femenino' as const },
    { label: 'Otro', value: 'Otro' as const }
  ];

  estados = [
    { label: 'Activo', value: 'Activo' as const },
    { label: 'Inactivo', value: 'Inactivo' as const }
  ];

  form: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    last_name: ['', [Validators.required, Validators.minLength(2)]],
    fechaNacimiento: [null, Validators.required], // p-datepicker devuelve Date
    genero: [this.generos[0].value, Validators.required], // 👈 usa .value
    phone: ['', [Validators.required, Validators.minLength(7)]],
    email: ['', [Validators.required, Validators.email]],
    direccion: [''],
    historialMedico: [''],
    status: [this.estados[0].value, Validators.required]   // 👈 usa .value
  });

  get f() { return this.form.controls; }

  guardar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toast.add({ severity: 'warn', summary: 'Campos faltantes', detail: 'Revisa los obligatorios.' });
      return;
    }

    const payload: Omit<patientsI, 'id'> = this.form.value as Omit<patientsI, 'id'>;

    this.service.create(payload).subscribe({
      next: () => {
        this.toast.add({ severity: 'success', summary: 'Paciente creado', detail: `${payload.name} ${payload.last_name}` });
        this.router.navigateByUrl('/pacientes'); // ajusta si tu ruta cambia
      },
      error: () => this.toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo crear el paciente' })
    });
  }

  cancelar() {
    this.router.navigateByUrl('/pacientes');
  }
}
