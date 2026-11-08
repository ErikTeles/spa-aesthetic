import { DecimalPipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import {
  ServicoEditDialog,
  ServicoEditDialogData,
} from '../../components/servico-edit-dialog/servico-edit-dialog';
import { ServicoService } from '../../../../shared/services/servico-service';
import { MessageService } from '../../../../shared/services/message-service';
import { Servico } from '../../../../shared/types/servico';

@Component({
  selector: 'app-admin-servicos',
  imports: [MatTableModule, MatIconModule, MatButtonModule, DecimalPipe],
  templateUrl: './admin-servicos.html',
  styleUrl: './admin-servicos.css',
})
export class AdminServicos implements OnInit {
  private readonly servicoService = inject(ServicoService);
  private readonly messageService = inject(MessageService);
  private readonly dialog = inject(MatDialog);

  readonly servicos = signal<Servico[]>([]);
  readonly displayedColumns = ['nomeItem', 'categoria', 'preco', 'ativo', 'actions'];

  ngOnInit(): void {
    this.carregarServicos();
  }

  openCreateDialog(): void {
    this.abrirDialogo({});
  }

  openEditDialog(servico: Servico): void {
    this.abrirDialogo({ servico });
  }

  excluirServico(servico: Servico): void {
    if (!servico.idItem) {
      return;
    }

    if (!confirm(`Deseja excluir o serviço ${servico.nomeItem}?`)) {
      return;
    }

    this.servicoService.deleteServico(servico.idItem).subscribe({
      next: () => {
        this.messageService.openMessage('Serviço excluído com sucesso!');
        this.carregarServicos();
      },
      error: (err) => {
        const message = err?.error?.message ?? err?.error;

        this.messageService.openMessage(
          typeof message === 'string' && message
            ? message
            : 'Não foi possível excluir o serviço.',
          'Fechar',
          5000,
        );
      },
    });
  }

  private abrirDialogo(data: ServicoEditDialogData): void {
    this.dialog
      .open<ServicoEditDialog, ServicoEditDialogData, boolean>(ServicoEditDialog, {
        data,
        width: '560px',
        autoFocus: 'first-tabbable',
      })
      .afterClosed()
      .subscribe((salvo) => {
        if (salvo) {
          this.carregarServicos();
        }
      });
  }

  private carregarServicos(): void {
    this.servicoService.getServicos().subscribe({
      next: (data: Servico[]) => this.servicos.set(data),
      error: (err) => console.error('Erro ao buscar serviços:', err),
    });
  }
}
