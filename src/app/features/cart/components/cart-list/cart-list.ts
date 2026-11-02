import { Component, inject } from '@angular/core';
import { CartItemRow } from '../cart-item-row/cart-item-row';
import { CartService } from '../../../../shared/services/cart-service';
import { CartItem } from '../../../../shared/types/cart-item';

@Component({
  selector: 'app-cart-list',
  imports: [CartItemRow],
  templateUrl: './cart-list.html',
  styleUrl: './cart-list.css',
})
export class CartList {
  public cartService = inject(CartService);
}
