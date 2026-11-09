import { DecimalPipe } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import {
  PedidoEditDialog,
  PedidoEditDialogData,
} from '../../components/pedido-edit-dialog/pedido-edit-dialog';
import { AtendimentoService } from '../../../../shared/services/atendimento-service';
import { MessageService } from '../../../../shared/services/message-service';
import { PessoaService } from '../../../../shared/services/pessoa-service';
import { Atendimento } from '../../../../shared/types/atendimento';
import { Pessoa } from '../../../../shared/types/pessoa';
import { statusAtendimentoLabel } from '../../../../shared/utils/atendimento-status';

@Component({
  selector: 'app-admin-pedidos',
  imports: [MatTableModule, MatIconModule, MatButtonModule, DecimalPipe],
  templateUrl: './admin-pedidos.html',
  styleUrl: './admin-pedidos.css',
})
export class AdminPedidos implements OnInit {
  private readonly atendimentoService = inject(AtendimentoService);
  private readonly pessoaService = inject(PessoaService);
  private readonly messageService = inject(MessageService);
  private readonly dialog = inject(MatDialog);

  readonly atendimentos = signal<Atendimento[]>([]);
  readonly pessoas = signal<Pessoa[]>([]);
  readonly situacaoAtiva = signal<string>('todas');
  readonly situacoes = computed(() => {
    const codigos = new Set(
      this.atendimentos()
        .map((atendimento) => (atendimento.statusAtendimento ?? '').trim().toUpperCase())
        .filter((codigo) => codigo.length > 0),
    );
    codigos.add('A');

    return [...codigos].sort();
  });
  readonly atendimentosFiltrados = computed(() => {
    const situacao = this.situacaoAtiva();

    if (situacao === 'todas') {
      return this.atendimentos();
    }

    return this.atendimentos().filter(
      (atendimento) =>
        (atendimento.statusAtendimento ?? '').trim().toUpperCase() === situacao,
    );
  });
  readonly statusLabel = statusAtendimentoLabel;
  readonly situacaoLabel = statusAtendimentoLabel;
  readonly displayedColumns = [
    'idAtendimento',
    'cliente',
    'dataAtendimento',
    'statusAtendimento',
    'quantidadeItens',
    'valorTotal',
    'actions',
  ];

  ngOnInit(): void {
    this.carregarAtendimentos();
    this.carregarPessoas();
  }

  openCreateDialog(): void {
    this.abrirDialogo({});
  }

  selecionarSituacao(codigo: string): void {
    this.situacaoAtiva.set(codigo);
  }

  openEditDialog(atendimento: Atendimento): void {
    this.abrirDialogo({ atendimento });
  }

  excluirAtendimento(atendimento: Atendimento): void {
    const cliente = this.nomeCliente(atendimento.idPessoa);

    if (!confirm(`Deseja excluir o pedido #${atendimento.idAtendimento} do cliente ${cliente}?`)) {
      return;
    }

    this.atendimentoService.deleteAtendimento(atendimento.idAtendimento).subscribe({
      next: () => {
        this.messageService.openMessage('Pedido excluído com sucesso!');
        this.carregarAtendimentos();
      },
      error: (err) => {
        const message = err?.error?.message ?? err?.error;

        this.messageService.openMessage(
          typeof message === 'string' && message ? message : 'Não foi possível excluir o pedido.',
          'Fechar',
          5000,
        );
      },
    });
  }

  nomeCliente(idPessoa: number): string {
    return (
      this.pessoas().find((pessoa) => pessoa.idPessoa === idPessoa)?.nome ?? `Pessoa #${idPessoa}`
    );
  }

  formatarData(dataAtendimento: string): string {
    return new Date(dataAtendimento).toLocaleString('pt-BR');
  }

  quantidadeItens(atendimento: Atendimento): number {
    return atendimento.itens?.length ?? 0;
  }

  totalAtendimento(atendimento: Atendimento): number {
    return (atendimento.itens ?? []).reduce(
      (total, item) => total + item.quantidadeItens * item.valorUnitarioEntrada,
      0,
    );
  }

  private abrirDialogo(data: PedidoEditDialogData): void {
    this.dialog
      .open<PedidoEditDialog, PedidoEditDialogData, boolean>(PedidoEditDialog, {
        data,
        width: '960px',
        maxWidth: '95vw',
        autoFocus: 'first-tabbable',
      })
      .afterClosed()
      .subscribe((salvo) => {
        if (salvo) {
          this.carregarAtendimentos();
        }
      });
  }

  private carregarAtendimentos(): void {
    this.atendimentoService.getAtendimentos().subscribe({
      next: (atendimentos) => this.atendimentos.set(atendimentos),
      error: (err) => console.error('Erro ao buscar pedidos:', err),
    });
  }

  private carregarPessoas(): void {
    this.pessoaService.getAllPessoas().subscribe({
      next: (pessoas) => this.pessoas.set(pessoas),
      error: (err) => console.error('Erro ao buscar pessoas:', err),
    });
  }
}
