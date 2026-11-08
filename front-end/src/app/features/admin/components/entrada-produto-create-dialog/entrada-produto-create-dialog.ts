import { Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { EntradaProdutoService } from '../../../../shared/services/entrada-produto-service';
import { MessageService } from '../../../../shared/services/message-service';
import { ProdutoService } from '../../../../shared/services/produto-service';
import { EntradaProdutoRequest } from '../../../../shared/types/entrada-produto';
import { Produto } from '../../../../shared/types/produto';

@Component({
  selector: 'app-entrada-produto-create-dialog',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
  ],
  templateUrl: './entrada-produto-create-dialog.html',
  styleUrl: './entrada-produto-create-dialog.css',
})
export class EntradaProdutoCreateDialog implements OnInit {
  private readonly dialogRef = inject(
    MatDialogRef<EntradaProdutoCreateDialog, boolean | undefined>,
  );
  private readonly entradaProdutoService = inject(EntradaProdutoService);
  private readonly produtoService = inject(ProdutoService);
  private readonly messageService = inject(MessageService);

  readonly salvando = signal(false);
  readonly produtos = signal<Produto[]>([]);

  readonly formEntrada = new FormGroup({
    idItem: new FormControl<number | null>(null, [Validators.required]),
    dataEntradaProduto: new FormControl(this.formatarDataHoraParaInput(new Date()), [
      Validators.required,
    ]),
    quantidadeEntrada: new FormControl<number | null>(null, [
      Validators.required,
      Validators.min(0.01),
    ]),
    unidade: new FormControl('', [Validators.required, Validators.maxLength(10)]),
    valorUnitarioEntrada: new FormControl<number | null>(null, [
      Validators.required,
      Validators.min(0),
    ]),
  });

  ngOnInit(): void {
    this.carregarProdutos();
  }

  onProdutoSelecionado(): void {
    const idItem = this.formEntrada.controls.idItem.value;

    if (idItem === null) {
      return;
    }

    const produto = this.produtos().find((item) => item.idItem === idItem);

    if (produto) {
      this.formEntrada.controls.unidade.setValue(produto.unidade);
    }
  }

  salvar(): void {
    if (this.formEntrada.invalid || this.salvando()) {
      this.formEntrada.markAllAsTouched();
      return;
    }

    const entradaValue = this.formEntrada.getRawValue();
    const entrada: EntradaProdutoRequest = {
      idItem: entradaValue.idItem!,
      dataEntradaProduto: (entradaValue.dataEntradaProduto ?? '').trim(),
      quantidadeEntrada: entradaValue.quantidadeEntrada ?? 0,
      unidade: (entradaValue.unidade ?? '').trim(),
      valorUnitarioEntrada: entradaValue.valorUnitarioEntrada ?? 0,
    };

    this.salvando.set(true);

    this.entradaProdutoService.createEntradaProduto(entrada).subscribe({
      next: () => {
        this.messageService.openMessage('Entrada cadastrada com sucesso!');
        this.dialogRef.close(true);
      },
      error: (err) => {
        this.salvando.set(false);

        const message = err?.error?.message ?? err?.error;

        this.messageService.openMessage(
          typeof message === 'string' && message
            ? message
            : 'Não foi possível cadastrar a entrada.',
          'Fechar',
          5000,
        );
      },
    });
  }

  private carregarProdutos(): void {
    this.produtoService.getProdutos().subscribe({
      next: (produtos) => this.produtos.set(produtos),
      error: (err) => {
        console.error('Erro ao buscar produtos:', err);
        this.messageService.openMessage('Não foi possível carregar os produtos.', 'Fechar', 5000);
      },
    });
  }

  private formatarDataHoraParaInput(value: string | Date): string {
    const data = value instanceof Date ? value : new Date(value);

    if (Number.isNaN(data.getTime())) {
      return '';
    }

    const pad = (numero: number) => String(numero).padStart(2, '0');

    return `${data.getFullYear()}-${pad(data.getMonth() + 1)}-${pad(data.getDate())}T${pad(data.getHours())}:${pad(data.getMinutes())}`;
  }
}
