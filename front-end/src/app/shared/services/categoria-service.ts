import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Categoria } from '../types/categoria';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CategoriaService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getAllCategorias(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(`${this.apiUrl}/Categoria`);
  }

  createCategoria(categoria: Categoria): Observable<Categoria> {
    return this.http.post<Categoria>(`${this.apiUrl}/Categoria`, categoria);
  }

  updateCategoria(categoria: Categoria): Observable<void> {
    return this.http.put<void>(
      `${this.apiUrl}/Categoria/${categoria.idCategoria}`,
      categoria,
    );
  }

  deleteCategoria(idCategoria: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/Categoria/${idCategoria}`);
  }
}
