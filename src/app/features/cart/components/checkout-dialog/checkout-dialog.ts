import { Component, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CpfMaskDirective } from '../../../../shared/directives/cpf-mask';
import { AtendimentoService } from '../../../../shared/services/atendimento-service';
import { CartService } from '../../../../shared/services/cart-service';
import { CustomerSessionService } from '../../../../shared/services/customer-session-service';
import { FuncionarioService } from '../../../../shared/services/funcionario-service';
import { MessageService } from '../../../../shared/services/message-service';
import { PessoaService } from '../../../../shared/services/pessoa-service';
import { Funcionario } from '../../../../shared/types/funcionario';

@Component({
  selector: 'app-checkout-dialog',
  imports: [
    DecimalPipe,
    RouterLink,
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    CpfMaskDirective,
  ],
  templateUrl: './checkout-dialog.html',
  styleUrl: './checkout-dialog.css',
})
export class CheckoutDialog {
  public cartService = inject(CartService);
  private customerSession = inject(CustomerSessionService);
  private pessoaService = inject(PessoaService);
  private funcionarioService = inject(FuncionarioService);
  private atendimentoService = inject(AtendimentoService);
  private messageService = inject(MessageService);
  private dialogRef = inject(MatDialogRef<CheckoutDialog, boolean>);

  public customer = this.customerSession.customer;
  public funcionarios = signal<Funcionario[]>([]);
  public identificando = signal(false);
  public enviando = signal(false);

  public formIdentificacao = new FormGroup({
    cpf: new FormControl('', [Validators.required]),
  });

  public formCheckout = new FormGroup({
    idFuncionario: new FormControl<number | null>(null, [Validators.required]),
  });

  constructor() {
    this.carregarFuncionarios();
  }

  buscarCliente(): void {
    const cpf = this.onlyDigits(this.formIdentificacao.controls.cpf.value ?? '');

    if (cpf.length !== 11) {
      this.formIdentificacao.markAllAsTouched();
      this.messageService.openMessage('Informe um CPF válido.', 'Fechar', 5000);
      return;
    }

    this.identificando.set(true);

    this.pessoaService.findByCpf(cpf).subscribe({
      next: (pessoa) => {
        this.identificando.set(false);

        if (!pessoa) {
          this.messageService.openMessage(
            'CPF não encontrado. Faça seu cadastro para continuar.',
            'Fechar',
            5000,
          );
          return;
        }

        this.customerSession.setCustomer(pessoa);
        this.formIdentificacao.reset();
      },
      error: () => {
        this.identificando.set(false);
        this.messageService.openMessage(
          'Não foi possível consultar o CPF. Tente novamente.',
          'Fechar',
          5000,
        );
      },
    });
  }

  trocarCliente(): void {
    this.customerSession.clear();
  }

  confirmar(): void {
    const customer = this.customer();
    const idPessoa = customer?.idPessoa;

    if (!idPessoa) {
      this.messageService.openMessage('Identifique-se para finalizar a compra.', 'Fechar', 5000);
      return;
    }

    if (this.formCheckout.invalid) {
      this.formCheckout.markAllAsTouched();
      return;
    }

    if (this.cartService.cartItems().length === 0) {
      this.messageService.openMessage('Seu carrinho está vazio.', 'Fechar', 5000);
      return;
    }

    const idFuncionario = this.formCheckout.controls.idFuncionario.value;

    if (!idFuncionario) {
      this.formCheckout.markAllAsTouched();
      return;
    }

    this.enviando.set(true);

    this.atendimentoService
      .checkout({
        idPessoa,
        idFuncionario,
        itens: this.cartService.cartItems().map((cartItem) => ({
          idItem: cartItem.item.idItem,
          quantidadeItens: cartItem.quantity,
        })),
      })
      .subscribe({
        next: (atendimento) => {
          this.enviando.set(false);
          this.cartService.removeAllItemsFromCart();
          this.messageService.openMessage(
            `Pedido #${atendimento.idAtendimento} registrado com sucesso!`,
            'Fechar',
            5000,
          );
          this.dialogRef.close(true);
        },
        error: (err) => {
          this.enviando.set(false);

          const message = err?.error?.message ?? err?.error;

          this.messageService.openMessage(
            typeof message === 'string' && message
              ? message
              : 'Não foi possível registrar o pedido. Tente novamente.',
            'Fechar',
            5000,
          );
        },
      });
  }

  formatCpf(value: string | null | undefined): string {
    return this.onlyDigits(value ?? '')
      .slice(0, 11)
      .replace(/^(\d{3})(\d)/, '$1.$2')
      .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3-$4');
  }

  private carregarFuncionarios(): void {
    this.funcionarioService.getAllFuncionarios().subscribe({
      next: (funcionarios) => this.funcionarios.set(funcionarios),
      error: () => {
        this.messageService.openMessage(
          'Não foi possível carregar os profissionais.',
          'Fechar',
          5000,
        );
      },
    });
  }

  private onlyDigits(value: string): string {
    return value.replace(/\D/g, '');
  }
}
