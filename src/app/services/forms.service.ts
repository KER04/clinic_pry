import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { AtencionI } from '../models/forms';

const LS_KEY = 'atenciones_store_v1';

type AtencionDTO = Omit<AtencionI, 'fecha'> & { fecha: string };

@Injectable({ providedIn: 'root' })
export class AtencionesLocalService {
  private store$ = new BehaviorSubject<AtencionI[]>(this.load());

  getAll$(): Observable<AtencionI[]> { return this.store$.asObservable(); }
  getAll(): AtencionI[] { return this.store$.value; }

  create(payload: Omit<AtencionI, 'id'>): Observable<AtencionI> {
    const list = this.store$.value;
    const nextId = (list.at(-1)?.id ?? 0) + 1;
    const nuevo: AtencionI = { id: nextId, ...payload };
    const updated = [...list, nuevo];
    this.store$.next(updated);
    this.persist(updated);
    return of(nuevo);
  }

  getById(id: number): Observable<AtencionI | undefined> {
    return of(this.store$.value.find(a => a.id === id));
  }

  update(id: number, patch: Partial<AtencionI>): Observable<AtencionI | undefined> {
    const list = this.store$.value;
    const idx = list.findIndex(a => a.id === id);
    if (idx === -1) return of(undefined);
    const updatedItem: AtencionI = { ...list[idx], ...patch };
    const updated = [...list];
    updated[idx] = updatedItem;
    this.store$.next(updated);
    this.persist(updated);
    return of(updatedItem);
  }

  delete(id: number): Observable<boolean> {
    const filtered = this.store$.value.filter(a => a.id !== id);
    const changed = filtered.length !== this.store$.value.length;
    if (changed) {
      this.store$.next(filtered);
      this.persist(filtered);
    }
    return of(changed);
  }

  reset(seed: AtencionI[] = []): void {
    this.persist(seed);
    this.store$.next(seed);
  }

  // --------- persistencia ---------
  private load(): AtencionI[] {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) { this.persist([]); return []; }
    try {
      const list = JSON.parse(raw) as AtencionDTO[];
      return list.map(a => ({ ...a, fecha: new Date(a.fecha) }));
    } catch {
      this.persist([]);
      return [];
    }
  }

  private persist(list: AtencionI[]) {
    const dto: AtencionDTO[] = list.map(a => ({
      ...a,
      // guardamos sólo YYYY-MM-DDTHH:mm:ssZ
      fecha: new Date(a.fecha).toISOString()
    }));
    localStorage.setItem(LS_KEY, JSON.stringify(dto));
  }
}
