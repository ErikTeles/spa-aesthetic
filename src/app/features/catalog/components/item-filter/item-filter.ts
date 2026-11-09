import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Component, input, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Categoria } from '../../../../shared/types/categoria';

export type TipoItemFiltro = 'todos' | 'P' | 'S';

export interface ItemFilters {
  nome: string;
  idCategoria: number | null;
  tipoItem: TipoItemFiltro;
}

export const FILTROS_INICIAIS: ItemFilters = {
  nome: '',
  idCategoria: null,
  tipoItem: 'todos',
};

@Component({
  selector: 'app-item-filter',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
  ],
  templateUrl: './item-filter.html',
  styleUrl: './item-filter.css',
})
export class ItemFilter {
  readonly categorias = input<Categoria[]>([]);
  readonly filtersChange = output<ItemFilters>();

  readonly formFiltro = new FormGroup({
    nome: new FormControl('', { nonNullable: true }),
    idCategoria: new FormControl<number | null>(null),
    tipoItem: new FormControl<TipoItemFiltro>('todos', { nonNullable: true }),
  });

  constructor() {
    this.formFiltro.valueChanges.pipe(takeUntilDestroyed()).subscribe(() => this.emitirFiltros());
  }

  limparFiltros(): void {
    this.formFiltro.reset(FILTROS_INICIAIS);
  }

  private emitirFiltros(): void {
    const { nome, idCategoria, tipoItem } = this.formFiltro.getRawValue();

    this.filtersChange.emit({
      nome: nome.trim(),
      idCategoria,
      tipoItem,
    });
  }
}
