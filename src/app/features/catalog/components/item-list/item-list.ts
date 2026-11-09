import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ItemCard } from '../item-card/item-card';
import { FILTROS_INICIAIS, ItemFilter, ItemFilters } from '../item-filter/item-filter';
import { CategoriaService } from '../../../../shared/services/categoria-service';
import { ItemService } from '../../../../shared/services/item-service';
import { Categoria } from '../../../../shared/types/categoria';
import { Item } from '../../../../shared/types/item';

@Component({
  selector: 'app-item-list',
  imports: [ItemCard, ItemFilter],
  templateUrl: './item-list.html',
  styleUrl: './item-list.css',
})
export class ItemList implements OnInit {
  private readonly itemService = inject(ItemService);
  private readonly categoriaService = inject(CategoriaService);

  readonly items = signal<Item[]>([]);
  readonly categorias = signal<Categoria[]>([]);
  readonly filtros = signal<ItemFilters>(FILTROS_INICIAIS);
  readonly carregando = signal(true);
  readonly erro = signal(false);
  readonly itensFiltrados = computed(() => this.filtrarItens(this.items(), this.filtros()));

  ngOnInit(): void {
    this.carregarItens();
    this.carregarCategorias();
  }

  atualizarFiltros(filtros: ItemFilters): void {
    this.filtros.set(filtros);
  }

  private carregarItens(): void {
    this.carregando.set(true);
    this.erro.set(false);

    this.itemService.getItems().subscribe({
      next: (itens: Item[]) => {
        this.items.set(itens);
        this.carregando.set(false);
      },
      error: (err) => {
        console.error('Falha ao carregar itens', err);
        this.erro.set(true);
        this.carregando.set(false);
      },
    });
  }

  private carregarCategorias(): void {
    this.categoriaService.getAllCategorias().subscribe({
      next: (categorias: Categoria[]) => this.categorias.set(categorias),
      error: (err) => console.error('Falha ao carregar categorias', err),
    });
  }

  private filtrarItens(itens: Item[], filtros: ItemFilters): Item[] {
    const termo = this.normalizarTexto(filtros.nome);

    return itens.filter((item) => {
      const nomeCorresponde = !termo || this.normalizarTexto(item.nomeItem).includes(termo);
      const categoriaCorresponde =
        filtros.idCategoria === null || item.categoria?.idCategoria === filtros.idCategoria;
      const tipoCorresponde = filtros.tipoItem === 'todos' || item.tipoItem === filtros.tipoItem;

      return nomeCorresponde && categoriaCorresponde && tipoCorresponde;
    });
  }

  private normalizarTexto(texto: string): string {
    return texto
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();
  }
}
