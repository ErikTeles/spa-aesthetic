import { Routes } from '@angular/router';
import { Catalog } from './features/catalog/pages/catalog/catalog';
import { Cart } from './features/cart/pages/cart/cart';
import { SignUp } from './features/user/sign-up/sign-up';
import { AdminLayout } from './features/admin/components/admin-layout/admin-layout';
import { AdminClientes } from './features/admin/pages/admin-clientes/admin-clientes';
import { AdminInitial } from './features/admin/pages/admin-initial/admin-initial';

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
  {
    path: 'admin',
    component: AdminLayout,
    children: [
      { path: '', component: AdminInitial },
      { path: 'clientes', component: AdminClientes },
      // { path: 'funcionarios', component: AdminFuncionarios },
      // { path: 'categorias', component: AdminCategorias },
      // { path: 'produtos', component: AdminItens, data: { tipo: 'P' } },
      // { path: 'servicos', component: AdminItens, data: { tipo: 'S' } },
      // { path: 'pedidos', component: AdminPedidos },
      // { path: 'entrada-produtos', component: AdminEntradaProdutos },
      // { path: 'estoque', component: AdminEstoque },
      { path: '**', redirectTo: '' },
    ],
  },
];
