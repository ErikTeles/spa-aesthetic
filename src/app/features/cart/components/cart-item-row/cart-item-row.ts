import { Component, computed, inject, input, output } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { CartItem } from '../../../../shared/types/cart-item';
import { CartService } from '../../../../shared/services/cart-service';

@Component({
  selector: 'app-cart-item-row',
  imports: [DecimalPipe],
  templateUrl: './cart-item-row.html',
  styleUrl: './cart-item-row.css',
})
export class CartItemRow {
  private cartService = inject(CartService);

  public item = input.required<CartItem>();
  public increaseQuantity = output<void>();
  public decreaseQuantity = output<void>();
  public removeItem = output<void>();

  public unitPrice = computed(() => this.cartService.getUnitPrice(this.item().item));
  public canDecrease = computed(() => this.item().quantity > 1);
}
