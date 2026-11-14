import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Funcionario } from '../types/funcionario';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FuncionarioService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getAllFuncionarios(): Observable<Funcionario[]> {
    return this.http.get<Funcionario[]>(`${this.apiUrl}/Funcionario`);
  }

  createFuncionario(funcionario: Funcionario): Observable<Funcionario> {
    return this.http.post<Funcionario>(`${this.apiUrl}/Funcionario`, funcionario);
  }

  updateFuncionario(funcionario: Funcionario): Observable<void> {
    return this.http.put<void>(
      `${this.apiUrl}/Funcionario/${funcionario.idFuncionario}`,
      funcionario,
    );
  }

  deleteFuncionario(idFuncionario: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/Funcionario/${idFuncionario}`);
  }
}
