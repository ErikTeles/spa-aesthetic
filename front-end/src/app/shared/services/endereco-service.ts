import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Endereco } from '../types/endereco';

@Injectable({
  providedIn: 'root',
})
export class EnderecoService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  createEndereco(endereco: Endereco) {
    return this.http.post(`${this.apiUrl}/Endereco`, endereco);
  }
}
