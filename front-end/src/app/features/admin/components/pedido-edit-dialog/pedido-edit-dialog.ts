import { DecimalPipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { concat, concatMap, from, Observable, switchMap } from 'rxjs';
import { AtendimentoService } from '../../../../shared/services/atendimento-service';
import { FuncionarioService } from '../../../../shared/services/funcionario-service';
import { ItemService } from '../../../../shared/services/item-service';
import { MessageService } from '../../../../shared/services/message-service';
import { PessoaService } from '../../../../shared/services/pessoa-service';
import {
  Atendimento,
  AtendimentoItem,
  AtendimentoItemRequest,
  AtendimentoRequest,
} from '../../../../shared/types/atendimento';
import { Funcionario } from '../../../../shared/types/funcionario';
import { Item } from '../../../../shared/types/item';
import { Pessoa } from '../../../../shared/types/pessoa';

type ItemFormGroup = FormGroup<{
  idItem: FormControl<number | null>;
  idFuncionario: FormControl<number | null>;
  quantidadeItens: FormControl<number | null>;
  valorUnitarioEntrada: FormControl<number | null>;
  novo: FormControl<boolean>;
}>;

type ItemFormValue = ReturnType<ItemFormGroup['getRawValue']>;

export interface PedidoEditDialogData {
  atendimento?: Atendimento;
}

@Component({
  selector: 'app-pedido-edit-dialog',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    DecimalPipe,
  ],
  templateUrl: './pedido-edit-dialog.html',
  styleUrl: './pedido-edit-dialog.css',
})
export class PedidoEditDialog implements OnInit {
  private readonly data = inject<PedidoEditDialogData>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<PedidoEditDialog, boolean | undefined>);
  private readonly atendimentoService = inject(AtendimentoService);
  private readonly pessoaService = inject(PessoaService);
  private readonly funcionarioService = inject(FuncionarioService);
  private readonly itemService = inject(ItemService);
  private readonly messageService = inject(MessageService);

  readonly salvando = signal(false);
  readonly editando = !!this.data.atendimento;
  readonly pessoas = signal<Pessoa[]>([]);
  readonly funcionarios = signal<Funcionario[]>([]);
  readonly itensCatalogo = signal<Item[]>([]);
  readonly itensForm = new FormArray<ItemFormGroup>([]);

  readonly formPedido = new FormGroup({
    idPessoa: new FormControl<number | null>(null, [Validators.required]),
    dataAtendimento: new FormControl('', [Validators.required]),
    statusAtendimento: new FormControl('A', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(1), Validators.pattern(/^[A-Za-z]$/)],
    }),
    itens: this.itensForm,
  });

  constructor() {
    const atendimento = this.data.atendimento;

    if (!atendimento) {
      this.formPedido.patchValue({
        dataAtendimento: this.formatarDataHoraParaInput(new Date()),
      });
      this.itensForm.push(this.criarItemFormGroup(undefined, true));
      return;
    }

    this.formPedido.patchValue({
      idPessoa: atendimento.idPessoa,
      dataAtendimento: this.formatarDataHoraParaInput(atendimento.dataAtendimento),
      statusAtendimento: atendimento.statusAtendimento ?? 'A',
    });
    this.formPedido.controls.idPessoa.disable();

    for (const item of atendimento.itens ?? []) {
      this.itensForm.push(this.criarItemFormGroup(item, false));
    }

    if (this.itensForm.length === 0) {
      this.itensForm.push(this.criarItemFormGroup(undefined, true));
    }
  }

  ngOnInit(): void {
    this.carregarPessoas();
    this.carregarFuncionarios();
    this.carregarItens();
  }

  adicionarItem(): void {
    this.itensForm.push(this.criarItemFormGroup(undefined, true));
  }

  removerItem(index: number): void {
    const item = this.itensForm.at(index);

    if (!item.controls.novo.value && !confirm('Deseja remover este item do pedido?')) {
      return;
    }

    this.itensForm.removeAt(index);
  }

  onItemSelecionado(index: number): void {
    const itemForm = this.itensForm.at(index);

    if (!itemForm.controls.novo.value) {
      return;
    }

    const idItem = itemForm.controls.idItem.value;

    if (idItem === null) {
      return;
    }

    const item = this.itensCatalogo().find((catalogoItem) => catalogoItem.idItem === idItem);

    if (item) {
      itemForm.controls.valorUnitarioEntrada.setValue(item.precoVenda ?? item.preco);
    }
  }

  opcaoItemDesabilitada(idItem: number | undefined, index: number): boolean {
    if (idItem === undefined) {
      return false;
    }

    const itemForm = this.itensForm.at(index);

    if (itemForm.controls.novo.value && this.itemEhOriginal(idItem)) {
      return true;
    }

    return this.itensForm.controls.some(
      (control, controlIndex) => controlIndex !== index && control.controls.idItem.value === idItem,
    );
  }

  totalPedido(): number {
    return this.itensForm.controls.reduce((total, itemForm) => {
      const item = itemForm.getRawValue();

      return total + (item.quantidadeItens ?? 0) * (item.valorUnitarioEntrada ?? 0);
    }, 0);
  }

  salvar(): void {
    if (this.salvando()) {
      return;
    }

    if (this.formPedido.invalid || this.itensForm.length === 0) {
      this.formPedido.markAllAsTouched();
      this.itensForm.markAllAsTouched();

      if (this.itensForm.length === 0) {
        this.messageService.openMessage('Adicione ao menos um item ao pedido.', 'Fechar', 5000);
      }

      return;
    }

    const itens = this.itensForm.controls.map((itemForm) => itemForm.getRawValue());
    const idsItens = itens.map((item) => item.idItem);

    if (new Set(idsItens).size !== idsItens.length) {
      this.messageService.openMessage(
        'Não é permitido adicionar o mesmo item mais de uma vez.',
        'Fechar',
        5000,
      );
      return;
    }

    const itemSemEstoque = itens.find((item) => !this.possuiEstoqueSuficiente(item));

    if (itemSemEstoque) {
      this.messageService.openMessage(
        'A quantidade informada é maior que o estoque disponível para um dos itens.',
        'Fechar',
        5000,
      );
      return;
    }

    const atendimentoValue = this.formPedido.getRawValue();
    const atendimento: AtendimentoRequest = {
      idPessoa: atendimentoValue.idPessoa!,
      dataAtendimento: (atendimentoValue.dataAtendimento ?? '').trim(),
      statusAtendimento: (atendimentoValue.statusAtendimento ?? '').trim().toUpperCase(),
    };

    this.salvando.set(true);

    if (this.editando) {
      this.atualizarAtendimento(atendimento, itens);
      return;
    }

    this.criarAtendimento(atendimento, itens);
  }

  private criarAtendimento(atendimento: AtendimentoRequest, itens: ItemFormValue[]): void {
    let atendimentoCriado: Atendimento | null = null;

    this.atendimentoService
      .createAtendimento(atendimento)
      .pipe(
        switchMap((criado) => {
          atendimentoCriado = criado;

          return from(itens).pipe(
            concatMap((item) =>
              this.atendimentoService.createAtendimentoItem(
                criado.idAtendimento,
                this.montarItemRequest(item),
              ),
            ),
          );
        }),
      )
      .subscribe({
        next: () => {
          this.messageService.openMessage('Pedido cadastrado com sucesso!');
          this.dialogRef.close(true);
        },
        error: (err) => {
          this.salvando.set(false);

          if (atendimentoCriado) {
            this.messageService.openMessage(
              `Pedido #${atendimentoCriado.idAtendimento} criado, mas houve falha ao adicionar um item: ${this.extrairMensagemErro(err, 'erro desconhecido.')}`,
              'Fechar',
              7000,
            );
            this.dialogRef.close(true);
            return;
          }

          this.messageService.openMessage(
            this.extrairMensagemErro(err, 'Não foi possível cadastrar o pedido.'),
            'Fechar',
            5000,
          );
        },
      });
  }

  private atualizarAtendimento(atendimento: AtendimentoRequest, itens: ItemFormValue[]): void {
    const atendimentoOriginal = this.data.atendimento!;
    const idAtendimento = atendimentoOriginal.idAtendimento;
    const idsAtuais = new Set(itens.map((item) => item.idItem));
    const itensRemovidos = (atendimentoOriginal.itens ?? []).filter(
      (item) => !idsAtuais.has(item.idItem),
    );
    const itensAdicionados = itens.filter((item) => item.novo);

    const operacoes: Observable<unknown>[] = [
      this.atendimentoService.updateAtendimento(idAtendimento, atendimento),
    ];

    for (const item of itensRemovidos) {
      operacoes.push(this.atendimentoService.deleteAtendimentoItem(idAtendimento, item.idItem));
    }

    for (const item of itensAdicionados) {
      operacoes.push(
        this.atendimentoService.createAtendimentoItem(idAtendimento, this.montarItemRequest(item)),
      );
    }

    concat(...operacoes).subscribe({
      next: () => {
        this.messageService.openMessage('Pedido atualizado com sucesso!');
        this.dialogRef.close(true);
      },
      error: (err) => {
        this.salvando.set(false);
        this.messageService.openMessage(
          this.extrairMensagemErro(err, 'Não foi possível atualizar o pedido.'),
          'Fechar',
          5000,
        );
      },
    });
  }

  private montarItemRequest(item: ItemFormValue): AtendimentoItemRequest {
    return {
      idItem: item.idItem!,
      idFuncionario: item.idFuncionario!,
      quantidadeItens: item.quantidadeItens!,
      valorUnitarioEntrada: item.valorUnitarioEntrada ?? null,
    };
  }

  private criarItemFormGroup(item: AtendimentoItem | undefined, novo: boolean): ItemFormGroup {
    const itemForm = new FormGroup({
      idItem: new FormControl<number | null>(item?.idItem ?? null, [Validators.required]),
      idFuncionario: new FormControl<number | null>(item?.idFuncionario ?? null, [
        Validators.required,
      ]),
      quantidadeItens: new FormControl<number | null>(item?.quantidadeItens ?? 1, [
        Validators.required,
        Validators.min(1),
      ]),
      valorUnitarioEntrada: new FormControl<number | null>(item?.valorUnitarioEntrada ?? null, [
        Validators.required,
        Validators.min(0),
      ]),
      novo: new FormControl(novo, { nonNullable: true }),
    });

    if (!novo) {
      itemForm.controls.idItem.disable();
      itemForm.controls.idFuncionario.disable();
      itemForm.controls.quantidadeItens.disable();
      itemForm.controls.valorUnitarioEntrada.disable();
    }

    return itemForm;
  }

  private itemEhOriginal(idItem: number): boolean {
    return (this.data.atendimento?.itens ?? []).some((item) => item.idItem === idItem);
  }

  private possuiEstoqueSuficiente(item: ItemFormValue): boolean {
    if (!item.novo) {
      return true;
    }

    const itemCatalogo = this.itensCatalogo().find(
      (catalogoItem) => catalogoItem.idItem === item.idItem,
    );

    if (
      itemCatalogo?.tipoItem !== 'P' ||
      itemCatalogo.quantidadeEstoque === null ||
      itemCatalogo.quantidadeEstoque === undefined
    ) {
      return true;
    }

    return (item.quantidadeItens ?? 0) <= itemCatalogo.quantidadeEstoque;
  }

  private carregarPessoas(): void {
    this.pessoaService.getAllPessoas().subscribe({
      next: (pessoas) => this.pessoas.set(pessoas),
      error: (err) => {
        console.error('Erro ao buscar pessoas:', err);
        this.messageService.openMessage('Não foi possível carregar os clientes.', 'Fechar', 5000);
      },
    });
  }

  private carregarFuncionarios(): void {
    this.funcionarioService.getAllFuncionarios().subscribe({
      next: (funcionarios) => this.funcionarios.set(funcionarios),
      error: (err) => {
        console.error('Erro ao buscar funcionários:', err);
        this.messageService.openMessage(
          'Não foi possível carregar os funcionários.',
          'Fechar',
          5000,
        );
      },
    });
  }

  private carregarItens(): void {
    this.itemService.getItems().subscribe({
      next: (itens) => this.itensCatalogo.set(itens),
      error: (err) => {
        console.error('Erro ao buscar itens:', err);
        this.messageService.openMessage('Não foi possível carregar os itens.', 'Fechar', 5000);
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

  private extrairMensagemErro(err: unknown, fallback: string): string {
    const error = err as { error?: { message?: unknown } | string } | null;
    const message =
      error?.error && typeof error.error === 'object' ? error.error.message : error?.error;

    return typeof message === 'string' && message.trim() ? message : fallback;
  }
}
