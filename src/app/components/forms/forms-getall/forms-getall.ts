import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { AtencionesLocalService } from '../../../services/forms.service';
import { PatientsLocalService } from '../../../services/patients.services';
import { combineLatest, map, Observable } from 'rxjs';
import { AtencionI } from '../../../models/forms';

@Component({
  selector: 'app-forms-getall',
  imports: [CommonModule, TableModule, ButtonModule],
  templateUrl: './forms-getall.html',
  styleUrl: './forms-getall.css'
})
export class FormsGetall {
  rows$!: Observable<(AtencionI & { paciente: string })[]>;

  constructor(private aSvc: AtencionesLocalService, private pSvc: PatientsLocalService) {
    this.rows$ = combineLatest([this.aSvc.getAll$(), this.pSvc.getAll$()]).pipe(
      map(([ats, pats]) => ats
        .map(a => {
          const p = pats.find(x => x.id === a.patient_id);
          return { ...a, paciente: p ? `${p.name} ${p.last_name}` : `#${a.patient_id}` };
        })
        .sort((a, b) => b.fecha.getTime() - a.fecha.getTime())
      )
    );
  }

  eliminar(row: AtencionI) { this.aSvc.delete(row.id).subscribe(); }
}
