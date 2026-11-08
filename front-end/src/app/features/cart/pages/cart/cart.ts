import { Component } from '@angular/core';
import { CartList } from '../../components/cart-list/cart-list';

@Component({
  selector: 'app-cart',
  imports: [CartList],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart {}
