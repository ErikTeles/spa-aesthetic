import { Component } from '@angular/core';
import { RouterOutlet, RouterLinkWithHref, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-admin-layout',
  imports: [RouterOutlet, RouterLinkActive, RouterLinkWithHref],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.css',
})
export class AdminLayout {
  menuItems = [
    { link: '/admin', icone: '📊', nome: 'Início' },
    { link: '/admin/clientes', icone: '👥', nome: 'Clientes' },
    { link: '/admin/funcionarios', icone: '🧑‍⚕️', nome: 'Funcionários' },
    { link: '/admin/categorias', icone: '🏷️', nome: 'Categorias' },
    { link: '/admin/produtos', icone: '🧴', nome: 'Produtos' },
    { link: '/admin/servicos', icone: '💆', nome: 'Serviços' },
    { link: '/admin/pedidos', icone: '📋', nome: 'Pedidos' },
    { link: '/admin/entrada-produtos', icone: '📦', nome: 'Entrada de produtos' },
  ];
}
