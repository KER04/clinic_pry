// src/app/components/citas/getall/getall.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';

import { Observable } from 'rxjs';
import { CitasService } from '../../../services/citas.services';
import { citasI } from '../../../models/citas';

@Component({
  selector: 'app-getall',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule, ConfirmDialogModule, ToastModule],
  templateUrl: './getall.html',
  styleUrls: ['./getall.css'],
  providers: [ConfirmationService, MessageService]
})
export class GetallCitas {
  citas$!: Observable<citasI[]>;

  constructor(
    private svc: CitasService,
    private confirm: ConfirmationService,
    private toast: MessageService
  ) {
    // ¡reactivo! cada cambio en el servicio repinta la tabla automáticamente
    this.citas$ = this.svc.citas$;
  }

  confirmarEliminar(c: citasI) {
    this.confirm.confirm({
      header: 'Eliminar cita',
      message: `¿Eliminar la cita de ${c.name} ${c.last_name} (${this.fmt(c.fecha)} - ${c.hora})?`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.svc.eliminar(c.id);
        this.toast.add({ severity: 'success', summary: 'Cita eliminada' });
      }
    });
  }

  private fmt(d: Date) {
    return new Date(d).toLocaleDateString('es-CO', { dateStyle: 'medium' });
  }
}
