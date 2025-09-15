import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { citasI } from '../../../models/citas';
import { CitasService } from '../../../services/citas.services';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Observable, map } from 'rxjs';

// PrimeNG modules
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputMaskModule } from 'primeng/inputmask';
import { DatePickerModule } from 'primeng/datepicker';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    // PrimeNG
    TableModule,
    DialogModule,
    ButtonModule,
    InputMaskModule,
    DatePickerModule,
    ToastModule,
    ConfirmDialogModule,
    AutoCompleteModule,   // <p-autoComplete>
    InputTextModule       // <input pInputText>
  ],
  templateUrl: './create.html',
  styleUrls: ['./create.css'],
  providers: [MessageService, ConfirmationService]
})
export class CreateCitas implements OnInit {
  citas$!: Observable<citasI[]>;
  // agrega esta propiedad a la clase
  minDate: Date = new Date();


  // filtros simples (usan ngModel)
  filtroMedico: string | null = null;
  filtroFecha?: Date[];

  // diálogo
  visible = false;
  tituloDialogo = 'Nueva cita';
  form!: FormGroup;
  editandoId?: number;

  // Listas base
  medicos: string[] = ['Dra. López', 'Dr. Ramírez', 'Dra. Gómez'];
  especialidades: string[] = ['Odontología', 'Medicina General', 'Dermatología'];

  // Sugerencias para p-autoComplete
  sugerenciasMedicos: string[] = [];        // filtro (ngModel)
  sugerenciasEspecialidades: string[] = []; // formControlName="specialty"
  sugerenciasMedicosForm: string[] = [];    // formControlName="medico"

  constructor(
    private fb: FormBuilder,
    private svc: CitasService,
    private toast: MessageService,
    private confirm: ConfirmationService
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      last_name: ['', [Validators.required, Validators.minLength(2)]],
      specialty: [null, Validators.required],
      medico: [null, Validators.required],
      fecha: [null, Validators.required], // Date solo día
      hora: ['', [Validators.required, Validators.pattern(/^([01]\d|2[0-3]):[0-5]\d$/)]], // "HH:mm"
    });

    this.citas$ = this.svc.citas$.pipe(map(cs => this.aplicarFiltros(cs)));
  }

  private aplicarFiltros(cs: citasI[]): citasI[] {
    let out = [...cs];
    if (this.filtroMedico) out = out.filter(c => c.medico === this.filtroMedico);
    if (this.filtroFecha?.length === 2 && this.filtroFecha[0] && this.filtroFecha[1]) {
      const i = new Date(this.filtroFecha[0]).setHours(0, 0, 0, 0);
      const f = new Date(this.filtroFecha[1]).setHours(23, 59, 59, 999);
      out = out.filter(c => {
        const d = new Date(c.fecha).setHours(0, 0, 0, 0);
        return d >= i && d <= f;
      });
    }
    return out.sort((a, b) => this.timestamp(b.fecha, b.hora) - this.timestamp(a.fecha, a.hora));
  }

  // ==== Métodos para p-autoComplete ====
  filtrarMedicos(event: { query: string }) {
    const q = (event.query || '').toLowerCase();
    this.sugerenciasMedicos = this.medicos.filter(m => m.toLowerCase().includes(q));
  }

  filtrarEspecialidades(event: { query: string }) {
    const q = (event.query || '').toLowerCase();
    this.sugerenciasEspecialidades = this.especialidades.filter(e => e.toLowerCase().includes(q));
  }

  filtrarMedicosForm(event: { query: string }) {
    const q = (event.query || '').toLowerCase();
    this.sugerenciasMedicosForm = this.medicos.filter(m => m.toLowerCase().includes(q));
  }
  // =====================================

  nueva(): void {
    this.tituloDialogo = 'Nueva cita';
    this.visible = true;
    this.editandoId = undefined;
    this.form.reset({ specialty: null, medico: null });
  }

  editar(c: citasI): void {
    this.tituloDialogo = 'Editar cita';
    this.visible = true;
    this.editandoId = c.id;
    this.form.reset({
      name: c.name,
      last_name: c.last_name,
      specialty: c.specialty,
      medico: c.medico,
      fecha: new Date(c.fecha),
      hora: c.hora,
    });
  }

  guardar(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const v = this.form.value;

    const candidato: Omit<citasI, 'id'> = {
      name: v.name, last_name: v.last_name,
      specialty: v.specialty, medico: v.medico,
      fecha: new Date(v.fecha), hora: v.hora,
    };

    if (this.svc.hayConflicto(candidato, this.editandoId)) {
      this.toast.add({ severity: 'error', summary: 'Conflicto de horario', detail: 'Ese horario ya está ocupado para ese médico.' });
      return;
    }

    if (this.editandoId) {
      this.svc.actualizar(this.editandoId, candidato);
      this.toast.add({ severity: 'success', summary: 'Cita actualizada' });
    } else {
      this.svc.crear(candidato);
      this.toast.add({ severity: 'success', summary: 'Cita creada' });
    }
    this.visible = false;
  }

  confirmarEliminar(c: citasI): void {
    this.confirm.confirm({
      message: `¿Eliminar la cita de ${c.name} ${c.last_name} (${this.fmtFechaHora(c.fecha, c.hora)})?`,
      header: 'Eliminar cita',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => { this.svc.eliminar(c.id); this.toast.add({ severity: 'success', summary: 'Cita eliminada' }); }
    });
  }

  fmtFechaHora(fecha: Date, hora: string): string {
    const [h, m] = hora.split(':').map(Number);
    const d = new Date(fecha);
    d.setHours(h, m, 0, 0);
    return d.toLocaleString('es-CO', { dateStyle: 'medium', timeStyle: 'short' });
  }

  private timestamp(fecha: Date, hora: string): number {
    const [h, m] = hora.split(':').map(Number);
    const d = new Date(fecha);
    d.setHours(h, m, 0, 0);
    return d.getTime();
  }
}
