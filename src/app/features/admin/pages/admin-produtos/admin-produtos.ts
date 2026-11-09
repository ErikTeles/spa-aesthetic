import { DecimalPipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
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
  imports: [
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    DecimalPipe,
  ],
  templateUrl: './admin-produtos.html',
  styleUrl: './admin-produtos.css',
})
export class AdminProdutos implements OnInit {
  private readonly produtoService = inject(ProdutoService);
  private readonly messageService = inject(MessageService);
  private readonly dialog = inject(MatDialog);

  readonly produtos = signal<Produto[]>([]);
  readonly carregando = signal(true);
  readonly consultaAtiva = signal(false);
  readonly idConsultado = signal<number | null>(null);
  readonly displayedColumns = [
    'idItem',
    'nomeItem',
    'categoria',
    'precoVenda',
    'quantidadeEstoque',
    'ativo',
    'actions',
  ];

  readonly formBusca = new FormGroup({
    idItem: new FormControl<number | null>(null, [Validators.required, Validators.min(1)]),
  });

  ngOnInit(): void {
    this.carregarProdutos();
  }

  buscarPorId(): void {
    if (this.formBusca.invalid) {
      this.formBusca.markAllAsTouched();
      return;
    }

    const idItem = this.formBusca.controls.idItem.value;

    if (!idItem || !Number.isInteger(idItem)) {
      this.messageService.openMessage('Informe um ID válido.', 'Fechar', 5000);
      return;
    }

    this.carregando.set(true);

    this.produtoService.getProdutoById(idItem).subscribe({
      next: (produto) => {
        this.produtos.set([produto]);
        this.consultaAtiva.set(true);
        this.idConsultado.set(idItem);
        this.carregando.set(false);
      },
      error: (err) => {
        this.carregando.set(false);

        if (err?.status === 404) {
          this.produtos.set([]);
          this.consultaAtiva.set(true);
          this.idConsultado.set(idItem);
          this.messageService.openMessage(
            `Produto com ID ${idItem} não encontrado.`,
            'Fechar',
            5000,
          );
          return;
        }

        this.messageService.openMessage(
          'Não foi possível consultar o produto.',
          'Fechar',
          5000,
        );
      },
    });
  }

  limparBusca(): void {
    this.formBusca.reset();
    this.consultaAtiva.set(false);
    this.idConsultado.set(null);
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
    this.consultaAtiva.set(false);
    this.idConsultado.set(null);
    this.formBusca.reset();
    this.carregando.set(true);

    this.produtoService.getProdutos().subscribe({
      next: (data: Produto[]) => {
        this.produtos.set(data);
        this.carregando.set(false);
      },
      error: (err) => {
        console.error('Erro ao buscar produtos:', err);
        this.carregando.set(false);
      },
    });
  }
}
