import { Component } from '@angular/core';
import { CartItemRow } from '../cart-item-row/cart-item-row';

@Component({
  selector: 'app-cart-list',
  imports: [CartItemRow],
  templateUrl: './cart-list.html',
  styleUrl: './cart-list.css',
})
export class CartList {}
