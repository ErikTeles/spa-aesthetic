import { Routes } from '@angular/router';
import { Catalog } from './features/catalog/pages/catalog/catalog';
import { Cart } from './features/cart/pages/cart/cart';
import { SignUp } from './features/user/sign-up/sign-up';
import { AdminLayout } from './features/admin/components/admin-layout/admin-layout';
import { AdminCategorias } from './features/admin/pages/admin-categorias/admin-categorias';
import { AdminClientes } from './features/admin/pages/admin-clientes/admin-clientes';
import { AdminFuncionarios } from './features/admin/pages/admin-funcionarios/admin-funcionarios';
import { AdminInitial } from './features/admin/pages/admin-initial/admin-initial';
import { AdminPedidos } from './features/admin/pages/admin-pedidos/admin-pedidos';
import { AdminProdutos } from './features/admin/pages/admin-produtos/admin-produtos';
import { AdminServicos } from './features/admin/pages/admin-servicos/admin-servicos';

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
      { path: 'funcionarios', component: AdminFuncionarios },
      { path: 'categorias', component: AdminCategorias },
      { path: 'produtos', component: AdminProdutos },
      { path: 'servicos', component: AdminServicos },
      { path: 'pedidos', component: AdminPedidos },
      // { path: 'entrada-produtos', component: AdminEntradaProdutos },
      // { path: 'estoque', component: AdminEstoque },
      { path: '**', redirectTo: '' },
    ],
  },
];
