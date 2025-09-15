import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { citasI } from '../models/citas';

const DURACION_MIN = 60; // cámbialo si usas otra duración

@Injectable({ providedIn: 'root' })
export class CitasService {
  private readonly _citas$ = new BehaviorSubject<citasI[]>([]);
  private _autoId = 1;

  constructor() {
    // demo
    const hoy = new Date();
    const demo: citasI = {
      id: this._autoId++,
      name: 'Juan',
      last_name: 'Pérez',
      specialty: 'Odontología',
      medico: 'Dra. López',
      fecha: new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate()),
      hora: '10:00'
    };
    this._citas$.next([demo]);
  }

  get citas$(): Observable<citasI[]> { return this._citas$.asObservable(); }
  list(): Observable<citasI[]> { return this.citas$; }

  byId(id: number): Observable<citasI | undefined> {
    return this.citas$.pipe(map(xs => xs.find(x => x.id === id)));
  }

  crear(cita: Omit<citasI, 'id'>): citasI {
    const nueva: citasI = { ...cita, id: this._autoId++ };
    this._citas$.next([nueva, ...this._citas$.value]);
    return nueva;
  }

  actualizar(id: number, cambios: Partial<citasI>): void {
    this._citas$.next(this._citas$.value.map(c => c.id === id ? { ...c, ...cambios } : c));
  }

  eliminar(id: number): void {
    this._citas$.next(this._citas$.value.filter(c => c.id !== id));
  }

  /** Chequea solapamiento para el mismo médico */
  hayConflicto(candidato: Omit<citasI, 'id'>, excluirId?: number): boolean {
    const [ini, fin] = this.aRango(candidato.fecha, candidato.hora, DURACION_MIN);
    return this._citas$.value.some(c => {
      if (excluirId && c.id === excluirId) return false;
      if (c.medico !== candidato.medico) return false;
      const [ci, cf] = this.aRango(c.fecha, c.hora, DURACION_MIN);
      return ini < cf && fin > ci; // solapamiento
    });
  }

  /** Utilidad: fecha(Date solo día) + "HH:mm" -> [inicio, fin] */
  private aRango(fecha: Date, hora: string, durMin: number): [number, number] {
    const [h, m] = hora.split(':').map(Number);
    const start = new Date(fecha);
    start.setHours(h, m, 0, 0);
    const end = new Date(start.getTime() + durMin * 60000);
    return [start.getTime(), end.getTime()];
  }
}
