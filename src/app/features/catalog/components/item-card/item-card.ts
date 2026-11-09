import { Component, inject, Input } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { Item } from '../../../../shared/types/item';
import { CartService } from '../../../../shared/services/cart-service';

@Component({
  selector: 'app-item-card',
  imports: [DecimalPipe],
  templateUrl: './item-card.html',
  styleUrl: './item-card.css',
})
export class ItemCard {
  @Input({ required: true }) item!: Item;
  private cartService = inject(CartService);

  addToCart(): void {
    this.cartService.addToCart(this.item);
  }
}
