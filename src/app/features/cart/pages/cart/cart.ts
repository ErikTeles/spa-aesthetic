import { Component } from '@angular/core';
import { CartList } from '../../components/cart-list/cart-list';
import { CartResume } from '../../components/cart-resume/cart-resume';

@Component({
  selector: 'app-cart',
  imports: [CartList, CartResume],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart {}
