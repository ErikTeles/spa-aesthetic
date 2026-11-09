import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Produto, ProdutoRequest } from '../types/produto';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProdutoService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getProdutos(): Observable<Produto[]> {
    return this.http.get<Produto[]>(`${this.apiUrl}/Item/Produtos`);
  }

  getProdutoById(idItem: number): Observable<Produto> {
    return this.http.get<Produto>(`${this.apiUrl}/Item/Produto/${idItem}`);
  }

  createProduto(produto: ProdutoRequest): Observable<Produto> {
    return this.http.post<Produto>(`${this.apiUrl}/Item/Produto`, produto);
  }

  updateProduto(idItem: number, produto: ProdutoRequest): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/Item/Produto/${idItem}`, produto);
  }

  deleteProduto(idItem: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/Item/Produto/${idItem}`);
  }
}
