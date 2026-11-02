import { Routes } from '@angular/router';
import { Catalog } from './features/catalog/pages/catalog/catalog';
import { Cart } from './features/cart/pages/cart/cart';

export const routes: Routes = [
  {
    path: '',
    component: Catalog,
  },
  {
    path: 'carrinho',
    component: Cart,
  },
];
