import { computed, Injectable, signal } from '@angular/core';
import { Item } from '../types/item';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private items = signal<Item[]>([]);
  // TODO: Implement a interface for the cart items and quantity
  //cartItemsCount = computed(() => this.items().reduce((sum, item) => sum + item.quantity, 0));

  addToCart(item: Item): void {
    const currentItems = this.items();
    this.items.set([...currentItems, item]);
  }
}
