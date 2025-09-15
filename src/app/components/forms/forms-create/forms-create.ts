import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';

import { AutoCompleteModule } from 'primeng/autocomplete';
import { InputTextModule } from 'primeng/inputtext';
import { InputMaskModule } from 'primeng/inputmask';
import { DatePickerModule } from 'primeng/datepicker';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { SelectButtonModule } from 'primeng/selectbutton';
import { MessageService, ConfirmationService } from 'primeng/api';

import { AtencionesLocalService } from '../../../services/forms.service';
import { PatientsLocalService } from '../../../services/patients.services';
import { patientsI } from '../../../models/patients';
import { AtencionI } from '../../../models/forms';

@Component({
  selector: 'app-forms-create',
  imports: [CommonModule, FormsModule, ReactiveFormsModule,
    AutoCompleteModule, InputTextModule, InputMaskModule, DatePickerModule,
    ButtonModule, DialogModule, TableModule, ToastModule, ConfirmDialogModule, SelectButtonModule],
  templateUrl: './forms-create.html',
  styleUrl: './forms-create.css',
  providers: [MessageService, ConfirmationService]
})
export class FormsCreate implements OnInit {
  // Paciente
  pacientes: patientsI[] = [];
  pacienteSel?: patientsI;
  sugerenciasPacientes: patientsI[] = [];
  minDate = new Date();


  // opciones para SelectButton (diagnóstico)
  tipoDiagOpts = [
    { label: 'Presuntivo', value: 'presuntivo' },
    { label: 'Definitivo', value: 'definitivo' }
  ];

  // opciones para SelectButton (vía de administración)
  vias = ['VO', 'IM', 'IV', 'SL', 'Inhalada', 'Tópica'];
  viasOpts = this.vias.map(v => ({ label: v, value: v }));

  // Catálogos mínimos (puedes reemplazar por API)
  cie10 = [
    { codigo: 'J00', descripcion: 'Resfriado común' },
    { codigo: 'K30', descripcion: 'Dispepsia' },
    { codigo: 'E11', descripcion: 'Diabetes mellitus tipo 2' },
  ];
  cups = [
    { codigo: '890201', descripcion: 'Consulta médica general' },
    { codigo: '902210', descripcion: 'Curación' },
  ];
  meds = [
    'Paracetamol 500 mg tabletas',
    'Ibuprofeno 400 mg tabletas',
    'Amoxicilina 500 mg cápsulas',
  ];


  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private atent: AtencionesLocalService,
    private patients: PatientsLocalService,
    private toast: MessageService,
  ) { }

  ngOnInit(): void {
    this.pacientes = this.patients.getAll(); // ya viene persistido en localStorage

    this.form = this.fb.group({
      patient_id: [null, Validators.required],
      fecha: [new Date(), Validators.required],
      motivo: [''],
      ta: [''], fc: [null], fr: [null], temp: [null], spo2: [null],
      diagnosticoForm: this.fb.group({
        codigo: [''], descripcion: [''], tipo: ['presuntivo', Validators.required]
      }),
      procedimientoForm: this.fb.group({
        codigo: [''], descripcion: [''], observacion: ['']
      }),
      recetaForm: this.fb.group({
        medicamento: [''], presentacion: [''], via: ['VO'],
        dosis: ['', Validators.required], frecuencia: ['', Validators.required], duracion: ['', Validators.required],
        indicaciones: ['']
      }),
      diagnosticos: this.fb.array([]),
      procedimientos: this.fb.array([]),
      receta: this.fb.array([]),
      notas: ['']
    });
  }

  // Accesos rápidos
  get diagnosticosFA() { return this.form.get('diagnosticos') as FormArray; }
  get procedimientosFA() { return this.form.get('procedimientos') as FormArray; }
  get recetaFA() { return this.form.get('receta') as FormArray; }

  // ---- Pacientes (autoComplete)
  filtrarPacientes(ev: { query: string }) {
    const q = (ev.query || '').toLowerCase();
    this.sugerenciasPacientes = this.pacientes.filter(p =>
      (`${p.name} ${p.last_name}`).toLowerCase().includes(q)
    );
  }
  onPacienteSeleccionado(p: patientsI) {
    this.pacienteSel = p;
    this.form.patchValue({ patient_id: p.id });
  }

  // ---- Diagnósticos
  addDiagnostico() {
    const df = this.form.get('diagnosticoForm') as FormGroup;
    const { codigo, descripcion, tipo } = df.value;
    if (!codigo || !descripcion) {
      this.toast.add({ severity: 'warn', summary: 'Completa código y descripción' });
      return;
    }
    this.diagnosticosFA.push(this.fb.group({ codigo, descripcion, tipo }));
    df.reset({ codigo: '', descripcion: '', tipo: 'presuntivo' });
  }
  removeDiagnostico(i: number) { this.diagnosticosFA.removeAt(i); }

  // ---- Procedimientos
  addProcedimiento() {
    const pf = this.form.get('procedimientoForm') as FormGroup;
    const { codigo, descripcion, observacion } = pf.value;
    if (!codigo || !descripcion) {
      this.toast.add({ severity: 'warn', summary: 'Completa código y descripción' });
      return;
    }
    this.procedimientosFA.push(this.fb.group({ codigo, descripcion, observacion }));
    pf.reset({ codigo: '', descripcion: '', observacion: '' });
  }
  removeProcedimiento(i: number) { this.procedimientosFA.removeAt(i); }

  // ---- Receta
  addRecetaItem() {
    const rf = this.form.get('recetaForm') as FormGroup;
    const { medicamento, presentacion, via, dosis, frecuencia, duracion, indicaciones } = rf.value;
    if (!medicamento || !dosis || !frecuencia || !duracion) {
      this.toast.add({ severity: 'warn', summary: 'Completa medicamento, dosis, frecuencia y duración' });
      return;
    }
    this.recetaFA.push(this.fb.group({ medicamento, presentacion, via, dosis, frecuencia, duracion, indicaciones }));
    rf.reset({ medicamento: '', presentacion: '', via: 'VO', dosis: '', frecuencia: '', duracion: '', indicaciones: '' });
  }
  removeRecetaItem(i: number) { this.recetaFA.removeAt(i); }

  // ---- Guardar
  guardar() {
    if (this.form.invalid || this.diagnosticosFA.length === 0) {
      this.form.markAllAsTouched();
      this.toast.add({ severity: 'error', summary: 'Faltan datos', detail: 'Paciente, fecha y al menos un diagnóstico' });
      return;
    }

    const v = this.form.value;
    const atencion: Omit<AtencionI, 'id'> = {
      patient_id: v.patient_id,
      fecha: v.fecha,
      motivo: v.motivo,
      signos_vitales: { ta: v.ta, fc: v.fc, fr: v.fr, temp: v.temp, spo2: v.spo2 },
      diagnosticos: v.diagnosticos,
      procedimientos: v.procedimientos,
      receta: v.receta,
      notas: v.notas
    };

    this.atent.create(atencion).subscribe(() => {
      this.toast.add({ severity: 'success', summary: 'Atención guardada' });
      // limpiar
      this.form.reset({ fecha: new Date(), diagnosticos: [], procedimientos: [], receta: [] });
      this.diagnosticosFA.clear(); this.procedimientosFA.clear(); this.recetaFA.clear();
      this.pacienteSel = undefined;
    });
  }
}