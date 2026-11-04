import { Routes } from '@angular/router';
import { Catalog } from './features/catalog/pages/catalog/catalog';
import { Cart } from './features/cart/pages/cart/cart';
import { SignUp } from './features/user/sign-up/sign-up';

export const routes: Routes = [
  {
    path: '',
    component: Catalog,
    pathMatch: 'full',
  },
  {
    path: 'carrinho',
    component: Cart,
  },
  {
    path: 'cadastro',
    component: SignUp,
  },
];
