import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Pessoa } from '../types/pessoa';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PessoaService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getAllPessoas(): Observable<Pessoa[]> {
    return this.http.get<Pessoa[]>(`${this.apiUrl}/Pessoa`);
  }

  createPessoa(pessoa: Pessoa): Observable<Pessoa> {
    return this.http.post<Pessoa>(`${this.apiUrl}/Pessoa`, pessoa);
  }

  updatePessoa(pessoa: Pessoa): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/Pessoa/${pessoa.idPessoa}`, pessoa);
  }
}
