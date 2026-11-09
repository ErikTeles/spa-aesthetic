import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Servico, ServicoRequest } from '../types/servico';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ServicoService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getServicos(): Observable<Servico[]> {
    return this.http.get<Servico[]>(`${this.apiUrl}/Item/Servicos`);
  }

  getServicoById(idItem: number): Observable<Servico> {
    return this.http.get<Servico>(`${this.apiUrl}/Item/Servico/${idItem}`);
  }

  createServico(servico: ServicoRequest): Observable<Servico> {
    return this.http.post<Servico>(`${this.apiUrl}/Item/Servico`, servico);
  }

  updateServico(idItem: number, servico: ServicoRequest): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/Item/Servico/${idItem}`, servico);
  }

  deleteServico(idItem: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/Item/Servico/${idItem}`);
  }
}
