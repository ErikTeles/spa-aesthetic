import { DecimalPipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterLink } from '@angular/router';
import { CpfMaskDirective } from '../../../../shared/directives/cpf-mask';
import { AtendimentoService } from '../../../../shared/services/atendimento-service';
import { CustomerSessionService } from '../../../../shared/services/customer-session-service';
import { MessageService } from '../../../../shared/services/message-service';
import { PessoaService } from '../../../../shared/services/pessoa-service';
import { PedidoCliente } from '../../../../shared/types/atendimento';
import {
  statusAtendimentoEmAberto,
  statusAtendimentoLabel,
} from '../../../../shared/utils/atendimento-status';
import {
  OrderDetailDialog,
  OrderDetailDialogData,
} from '../../components/order-detail-dialog/order-detail-dialog';

@Component({
  selector: 'app-my-orders',
  imports: [
    DecimalPipe,
    RouterLink,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    CpfMaskDirective,
  ],
  templateUrl: './my-orders.html',
  styleUrl: './my-orders.css',
})
export class MyOrders implements OnInit {
  private atendimentoService = inject(AtendimentoService);
  private pessoaService = inject(PessoaService);
  private customerSession = inject(CustomerSessionService);
  private messageService = inject(MessageService);
  private dialog = inject(MatDialog);

  public customer = this.customerSession.customer;
  public pedidos = signal<PedidoCliente[]>([]);
  public carregando = signal(false);
  public buscandoCpf = signal(false);
  public erro = signal<string | null>(null);

  public formIdentificacao = new FormGroup({
    cpf: new FormControl('', [Validators.required]),
  });

  ngOnInit(): void {
    this.carregarPedidosSeIdentificado();
  }

  buscarCliente(): void {
    const cpf = this.onlyDigits(this.formIdentificacao.controls.cpf.value ?? '');

    if (cpf.length !== 11) {
      this.formIdentificacao.markAllAsTouched();
      this.messageService.openMessage('Informe um CPF válido.', 'Fechar', 5000);
      return;
    }

    this.buscandoCpf.set(true);

    this.pessoaService.findByCpf(cpf).subscribe({
      next: (pessoa) => {
        this.buscandoCpf.set(false);

        if (!pessoa?.idPessoa) {
          this.messageService.openMessage(
            'CPF não encontrado. Faça seu cadastro para consultar seus pedidos.',
            'Fechar',
            5000,
          );
          return;
        }

        this.customerSession.setCustomer(pessoa);
        this.formIdentificacao.reset();
        this.carregarPedidos(pessoa.idPessoa);
      },
      error: () => {
        this.buscandoCpf.set(false);
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
    this.pedidos.set([]);
    this.erro.set(null);
  }

  recarregar(): void {
    const idPessoa = this.customer()?.idPessoa;

    if (idPessoa) {
      this.carregarPedidos(idPessoa);
    }
  }

  openDetalhes(pedido: PedidoCliente): void {
    this.dialog.open<OrderDetailDialog, OrderDetailDialogData>(OrderDetailDialog, {
      data: { pedido },
      width: '40rem',
      maxWidth: '95vw',
      autoFocus: 'first-tabbable',
    });
  }

  formatarData(dataAtendimento: string): string {
    return new Date(dataAtendimento).toLocaleString('pt-BR');
  }

  quantidadeItens(pedido: PedidoCliente): number {
    return pedido.itens.reduce((total, item) => total + item.quantidadeItens, 0);
  }

  itensLabel(pedido: PedidoCliente): string {
    const quantidade = this.quantidadeItens(pedido);

    return quantidade === 1 ? '1 item' : `${quantidade} itens`;
  }

  totalPedido(pedido: PedidoCliente): number {
    return pedido.itens.reduce(
      (total, item) => total + item.quantidadeItens * item.valorUnitarioEntrada,
      0,
    );
  }

  statusLabel(pedido: PedidoCliente): string {
    return statusAtendimentoLabel(pedido.statusAtendimento);
  }

  statusEmAberto(pedido: PedidoCliente): boolean {
    return statusAtendimentoEmAberto(pedido.statusAtendimento);
  }

  formatCpf(value: string | null | undefined): string {
    return this.onlyDigits(value ?? '')
      .slice(0, 11)
      .replace(/^(\d{3})(\d)/, '$1.$2')
      .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3-$4');
  }

  private carregarPedidosSeIdentificado(): void {
    const idPessoa = this.customer()?.idPessoa;

    if (idPessoa) {
      this.carregarPedidos(idPessoa);
    }
  }

  private carregarPedidos(idPessoa: number): void {
    this.carregando.set(true);
    this.erro.set(null);

    this.atendimentoService.getPedidosPorPessoa(idPessoa).subscribe({
      next: (pedidos) => {
        this.carregando.set(false);
        this.pedidos.set(pedidos);
      },
      error: (err) => {
        this.carregando.set(false);

        const message = err?.error?.message ?? err?.error;

        this.erro.set(
          typeof message === 'string' && message
            ? message
            : 'Não foi possível carregar seus pedidos.',
        );
      },
    });
  }

  private onlyDigits(value: string): string {
    return value.replace(/\D/g, '');
  }
}
