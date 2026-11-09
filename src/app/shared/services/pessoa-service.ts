import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Pessoa } from '../types/pessoa';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PessoaService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getAllPessoas(): Observable<Pessoa[]> {
    return this.http.get<Pessoa[]>(`${this.apiUrl}/Pessoa`);
  }

  getPessoaById(idPessoa: number): Observable<Pessoa> {
    return this.http.get<Pessoa>(`${this.apiUrl}/Pessoa/${idPessoa}`);
  }

  findByCpf(cpf: string): Observable<Pessoa | undefined> {
    const digits = cpf.replace(/\D/g, '');

    return this.getAllPessoas().pipe(
      map((pessoas) =>
        pessoas.find((pessoa) => pessoa.cpf.replace(/\D/g, '') === digits),
      ),
    );
  }

  createPessoa(pessoa: Pessoa): Observable<Pessoa> {
    return this.http.post<Pessoa>(`${this.apiUrl}/Pessoa`, pessoa);
  }

  updatePessoa(pessoa: Pessoa): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/Pessoa/${pessoa.idPessoa}`, pessoa);
  }
}
