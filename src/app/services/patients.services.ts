import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { patientsI } from '../models/patients';

const LS_KEY = 'patients_store_v1';

// 👇 Datos semilla (ajústalos a gusto)
const SEED: patientsI[] = [
  {
    id: 1, name: 'María', last_name: 'González',
    fechaNacimiento: new Date('1992-03-11'), genero: 'Femenino',
    phone: '3001234567', email: 'maria.gonzalez@example.com',
    direccion: 'Calle 10 # 5-20', historialMedico: 'Sin antecedentes',
    status: 'Activo'
  },
  {
    id: 2, name: 'Juan', last_name: 'Pérez',
    fechaNacimiento: new Date('1988-07-25'), genero: 'Masculino',
    phone: '3015558899', email: 'juan.perez@example.com',
    direccion: 'Carrera 45 # 12-34', historialMedico: 'Alergia a penicilina',
    status: 'Activo'
  },
  {
    id: 3, name: 'Camila', last_name: 'Rodríguez',
    fechaNacimiento: new Date('1995-11-02'), genero: 'Femenino',
    phone: '3021112233', email: 'camila.rodriguez@example.com',
    direccion: 'Transversal 8 # 22-18', historialMedico: 'Asma controlada',
    status: 'Inactivo'
  }
];

type PatientDTO = Omit<patientsI, 'fechaNacimiento'> & { fechaNacimiento: string };

@Injectable({ providedIn: 'root' })
export class PatientsLocalService {
  private store$ = new BehaviorSubject<patientsI[]>(this.load());

  /** Observable para tu tabla */
  getAll$(): Observable<patientsI[]> {
    return this.store$.asObservable();
  }

  /** (Opcional) acceso síncrono si lo prefieres */
  getAll(): patientsI[] {
    return this.store$.value;
  }

  /** Resetea a los datos semilla (opcional) */
  reset(): void {
    this.persist(SEED);
    this.store$.next(SEED);
  }

  // --------- helpers de persistencia ---------
  private load(): patientsI[] {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) {
      this.persist(SEED);
      return SEED;
    }
    try {
      const list = JSON.parse(raw) as PatientDTO[];
      return list.map(p => ({
        ...p,
        // convierte string -> Date
        fechaNacimiento: new Date(p.fechaNacimiento)
      }));
    } catch {
      this.persist(SEED);
      return SEED;
    }
  }

  private persist(list: patientsI[]) {
    const dto: PatientDTO[] = list.map(p => ({
      ...p,
      // guardamos solo 'YYYY-MM-DD' para evitar problemas de zona horaria
      fechaNacimiento: new Date(
        Date.UTC(p.fechaNacimiento.getFullYear(), p.fechaNacimiento.getMonth(), p.fechaNacimiento.getDate())
      ).toISOString().slice(0, 10)
    }));
    localStorage.setItem(LS_KEY, JSON.stringify(dto));
  }

  //---------------------------------------------------------------------------


  //crear paciente
    // ------- CRUD sin delay -------
  create(payload: Omit<patientsI, 'id'>): Observable<patientsI> {
    const list = this.store$.value;
    const nextId = (list.at(-1)?.id ?? 0) + 1;
    const nuevo: patientsI = { id: nextId, ...payload };

    const updated = [...list, nuevo];
    this.store$.next(updated);
    this.persist(updated);

    return of(nuevo); // ← sin delay
  }

  getById(id: number): Observable<patientsI | undefined> {
    const found = this.store$.value.find(p => p.id === id);
    return of(found); // ← sin delay
  }

  update(id: number, patch: Partial<patientsI>): Observable<patientsI | undefined> {
    const list = this.store$.value;
    const idx = list.findIndex(p => p.id === id);
    if (idx === -1) return of(undefined);

    const updatedItem: patientsI = { ...list[idx], ...patch };
    const updated = [...list];
    updated[idx] = updatedItem;

    this.store$.next(updated);
    this.persist(updated);

    return of(updatedItem); // ← sin delay
  }

  delete(id: number): Observable<boolean> {
    const filtered = this.store$.value.filter(p => p.id !== id);
    const changed = filtered.length !== this.store$.value.length;

    if (changed) {
      this.store$.next(filtered);
      this.persist(filtered);
    }
    return of(changed); // ← sin delay
  }

  
}
