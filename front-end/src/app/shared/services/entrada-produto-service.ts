import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { EntradaProduto, EntradaProdutoRequest } from '../types/entrada-produto';

@Injectable({
  providedIn: 'root',
})
export class EntradaProdutoService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getEntradasProduto(): Observable<EntradaProduto[]> {
    return this.http.get<EntradaProduto[]>(`${this.apiUrl}/EntradaProduto`);
  }

  createEntradaProduto(entradaProduto: EntradaProdutoRequest): Observable<EntradaProduto> {
    return this.http.post<EntradaProduto>(`${this.apiUrl}/EntradaProduto`, entradaProduto);
  }
}
