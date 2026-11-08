import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { Item } from '../types/item';

@Injectable({
  providedIn: 'root',
})
export class ItemService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getItems(): Observable<Item[]> {
    return this.http.get<Item[]>(this.apiUrl + '/Item');
  }
}
