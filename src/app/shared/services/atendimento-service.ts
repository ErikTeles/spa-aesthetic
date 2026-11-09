import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  Atendimento,
  AtendimentoItem,
  AtendimentoItemRequest,
  AtendimentoRequest,
  PedidoCliente,
} from '../types/atendimento';
import { CheckoutRequest } from '../types/checkout';

@Injectable({
  providedIn: 'root',
})
export class AtendimentoService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getAtendimentos(): Observable<Atendimento[]> {
    return this.http.get<Atendimento[]>(`${this.apiUrl}/Atendimento`);
  }

  getAtendimentoById(idAtendimento: number): Observable<Atendimento> {
    return this.http.get<Atendimento>(`${this.apiUrl}/Atendimento/${idAtendimento}`);
  }

  getPedidosPorPessoa(idPessoa: number): Observable<PedidoCliente[]> {
    return this.http.get<PedidoCliente[]>(`${this.apiUrl}/Atendimento/Pessoa/${idPessoa}`);
  }

  createAtendimento(atendimento: AtendimentoRequest): Observable<Atendimento> {
    return this.http.post<Atendimento>(`${this.apiUrl}/Atendimento`, atendimento);
  }

  updateAtendimento(idAtendimento: number, atendimento: AtendimentoRequest): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/Atendimento/${idAtendimento}`, atendimento);
  }

  deleteAtendimento(idAtendimento: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/Atendimento/${idAtendimento}`);
  }

  createAtendimentoItem(
    idAtendimento: number,
    item: AtendimentoItemRequest,
  ): Observable<AtendimentoItem> {
    return this.http.post<AtendimentoItem>(
      `${this.apiUrl}/Atendimento/${idAtendimento}/Item`,
      item,
    );
  }

  deleteAtendimentoItem(idAtendimento: number, idItem: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/Atendimento/${idAtendimento}/Item/${idItem}`);
  }

  checkout(checkout: CheckoutRequest): Observable<Atendimento> {
    return this.http.post<Atendimento>(`${this.apiUrl}/Atendimento/Checkout`, checkout);
  }
}
