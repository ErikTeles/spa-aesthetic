import { Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MessageService } from '../../../../shared/services/message-service';
import { ProdutoService } from '../../../../shared/services/produto-service';
import { CategoriaService } from '../../../../shared/services/categoria-service';
import { Produto, ProdutoRequest } from '../../../../shared/types/produto';
import { Categoria } from '../../../../shared/types/categoria';
import { Observable } from 'rxjs';

export interface ProdutoEditDialogData {
  produto?: Produto;
}

@Component({
  selector: 'app-produto-edit-dialog',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
  ],
  templateUrl: './produto-edit-dialog.html',
  styleUrl: './produto-edit-dialog.css',
})
export class ProdutoEditDialog implements OnInit {
  private readonly data = inject<ProdutoEditDialogData>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<ProdutoEditDialog, boolean | undefined>);
  private readonly produtoService = inject(ProdutoService);
  private readonly categoriaService = inject(CategoriaService);
  private readonly messageService = inject(MessageService);

  readonly salvando = signal(false);
  readonly editando = !!this.data.produto;
  readonly categorias = signal<Categoria[]>([]);

  readonly formProduto = new FormGroup({
    nomeItem: new FormControl('', [Validators.required, Validators.maxLength(40)]),
    idCategoria: new FormControl<number | null>(null, [Validators.required]),
    descricaoItem: new FormControl('', [Validators.maxLength(200)]),
    preco: new FormControl<number | null>(null, [Validators.required, Validators.min(0)]),
    precoVenda: new FormControl<number | null>(null, [Validators.required, Validators.min(0)]),
    codigoPreco: new FormControl<number | null>(null),
    unidade: new FormControl('', [Validators.required, Validators.maxLength(10)]),
    ativo: new FormControl(true),
  });

  constructor() {
    const produto = this.data.produto;

    if (!produto) {
      return;
    }

    this.formProduto.setValue({
      nomeItem: produto.nomeItem ?? '',
      idCategoria: produto.categoria?.idCategoria ?? null,
      descricaoItem: produto.descricaoItem ?? '',
      preco: produto.preco,
      precoVenda: produto.precoVenda,
      codigoPreco: produto.codigoPreco,
      unidade: produto.unidade ?? '',
      ativo: produto.ativo,
    });
  }

  ngOnInit(): void {
    this.categoriaService.getAllCategorias().subscribe({
      next: (data: Categoria[]) => this.categorias.set(data),
      error: (err) => {
        console.error('Erro ao buscar categorias:', err);
        this.messageService.openMessage(
          'Não foi possível carregar as categorias.',
          'Fechar',
          5000,
        );
      },
    });
  }

  salvar(): void {
    if (this.formProduto.invalid || this.salvando()) {
      this.formProduto.markAllAsTouched();
      return;
    }

    const produtoValue = this.formProduto.getRawValue();
    const produto: ProdutoRequest = {
      nomeItem: (produtoValue.nomeItem ?? '').trim(),
      idCategoria: produtoValue.idCategoria!,
      descricaoItem: produtoValue.descricaoItem?.trim() || null,
      preco: produtoValue.preco ?? 0,
      ativo: produtoValue.ativo ?? true,
      precoVenda: produtoValue.precoVenda ?? 0,
      codigoPreco: produtoValue.codigoPreco ?? null,
      unidade: (produtoValue.unidade ?? '').trim(),
    };

    const idItem = this.data.produto?.idItem;

    this.salvando.set(true);

    const request$: Observable<unknown> =
      this.editando && idItem !== undefined
        ? this.produtoService.updateProduto(idItem, produto)
        : this.produtoService.createProduto(produto);

    request$.subscribe({
      next: () => {
        this.messageService.openMessage(
          this.editando
            ? 'Produto atualizado com sucesso!'
            : 'Produto cadastrado com sucesso!',
        );
        this.dialogRef.close(true);
      },
      error: (err) => {
        this.salvando.set(false);

        const message = err?.error?.message ?? err?.error;

        this.messageService.openMessage(
          typeof message === 'string' && message
            ? message
            : this.editando
              ? 'Não foi possível atualizar o produto.'
              : 'Não foi possível cadastrar o produto.',
          'Fechar',
          5000,
        );
      },
    });
  }
}
