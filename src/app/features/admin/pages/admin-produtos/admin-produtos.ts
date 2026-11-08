import { DecimalPipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import {
  ProdutoEditDialog,
  ProdutoEditDialogData,
} from '../../components/produto-edit-dialog/produto-edit-dialog';
import { ProdutoService } from '../../../../shared/services/produto-service';
import { MessageService } from '../../../../shared/services/message-service';
import { Produto } from '../../../../shared/types/produto';

@Component({
  selector: 'app-admin-produtos',
  imports: [MatTableModule, MatIconModule, MatButtonModule, DecimalPipe],
  templateUrl: './admin-produtos.html',
  styleUrl: './admin-produtos.css',
})
export class AdminProdutos implements OnInit {
  private readonly produtoService = inject(ProdutoService);
  private readonly messageService = inject(MessageService);
  private readonly dialog = inject(MatDialog);

  readonly produtos = signal<Produto[]>([]);
  readonly displayedColumns = [
    'nomeItem',
    'categoria',
    'precoVenda',
    'quantidadeEstoque',
    'ativo',
    'actions',
  ];

  ngOnInit(): void {
    this.carregarProdutos();
  }

  openCreateDialog(): void {
    this.abrirDialogo({});
  }

  openEditDialog(produto: Produto): void {
    this.abrirDialogo({ produto });
  }

  excluirProduto(produto: Produto): void {
    if (!produto.idItem) {
      return;
    }

    if (!confirm(`Deseja excluir o produto ${produto.nomeItem}?`)) {
      return;
    }

    this.produtoService.deleteProduto(produto.idItem).subscribe({
      next: () => {
        this.messageService.openMessage('Produto excluído com sucesso!');
        this.carregarProdutos();
      },
      error: (err) => {
        const message = err?.error?.message ?? err?.error;

        this.messageService.openMessage(
          typeof message === 'string' && message
            ? message
            : 'Não foi possível excluir o produto.',
          'Fechar',
          5000,
        );
      },
    });
  }

  private abrirDialogo(data: ProdutoEditDialogData): void {
    this.dialog
      .open<ProdutoEditDialog, ProdutoEditDialogData, boolean>(ProdutoEditDialog, {
        data,
        width: '640px',
        autoFocus: 'first-tabbable',
      })
      .afterClosed()
      .subscribe((salvo) => {
        if (salvo) {
          this.carregarProdutos();
        }
      });
  }

  private carregarProdutos(): void {
    this.produtoService.getProdutos().subscribe({
      next: (data: Produto[]) => this.produtos.set(data),
      error: (err) => console.error('Erro ao buscar produtos:', err),
    });
  }
}
