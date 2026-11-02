import { Component, inject, input, output } from '@angular/core';
import { CartItem } from '../../../../shared/types/cart-item';
import { DecimalPipe } from '@angular/common';
import { CartService } from '../../../../shared/services/cart-service';

@Component({
  selector: 'app-cart-item-row',
  imports: [DecimalPipe],
  templateUrl: './cart-item-row.html',
  styleUrl: './cart-item-row.css',
})
export class CartItemRow {
  public item = input.required<CartItem>();
  public removeItem = output();
}
