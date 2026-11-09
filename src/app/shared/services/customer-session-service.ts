import { computed, Injectable, signal } from '@angular/core';
import { Pessoa } from '../types/pessoa';

const STORAGE_KEY = 'spa-aesthetic.customer';

@Injectable({
  providedIn: 'root',
})
export class CustomerSessionService {
  private customerSignal = signal<Pessoa | null>(this.loadFromStorage());
  public customer = this.customerSignal.asReadonly();
  public isIdentified = computed(() => !!this.customerSignal()?.idPessoa);

  setCustomer(customer: Pessoa): void {
    this.customerSignal.set(customer);
    this.persist(customer);
  }

  clear(): void {
    this.customerSignal.set(null);

    if (typeof window === 'undefined') {
      return;
    }

    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignora falhas de armazenamento (ex.: modo privado).
    }
  }

  private loadFromStorage(): Pessoa | null {
    if (typeof window === 'undefined') {
      return null;
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? (JSON.parse(stored) as Pessoa) : null;
    } catch {
      return null;
    }
  }

  private persist(customer: Pessoa): void {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(customer));
    } catch {
      // Ignora falhas de armazenamento (ex.: modo privado).
    }
  }
}
