import { Component, inject, OnInit, signal } from '@angular/core';
import { ItemCard } from '../item-card/item-card';
import { ItemService } from '../../../../shared/services/item-service';
import { Item } from '../../../../shared/types/item';

@Component({
  selector: 'app-item-list',
  imports: [ItemCard],
  templateUrl: './item-list.html',
  styleUrl: './item-list.css',
})
export class ItemList implements OnInit {
  private itemService = inject(ItemService);
  public items = signal<Item[]>([]);

  ngOnInit(): void {
    this.itemService.getItems().subscribe((itens: Item[]) => {
      this.items.set(itens);
    });
  }
}
