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
  ServicoEditDialog,
  ServicoEditDialogData,
} from '../../components/servico-edit-dialog/servico-edit-dialog';
import { ServicoService } from '../../../../shared/services/servico-service';
import { MessageService } from '../../../../shared/services/message-service';
import { Servico } from '../../../../shared/types/servico';

@Component({
  selector: 'app-admin-servicos',
  imports: [
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    DecimalPipe,
  ],
  templateUrl: './admin-servicos.html',
  styleUrl: './admin-servicos.css',
})
export class AdminServicos implements OnInit {
  private readonly servicoService = inject(ServicoService);
  private readonly messageService = inject(MessageService);
  private readonly dialog = inject(MatDialog);

  readonly servicos = signal<Servico[]>([]);
  readonly carregando = signal(true);
  readonly consultaAtiva = signal(false);
  readonly idConsultado = signal<number | null>(null);
  readonly displayedColumns = ['idItem', 'nomeItem', 'categoria', 'preco', 'ativo', 'actions'];

  readonly formBusca = new FormGroup({
    idItem: new FormControl<number | null>(null, [Validators.required, Validators.min(1)]),
  });

  ngOnInit(): void {
    this.carregarServicos();
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

    this.servicoService.getServicoById(idItem).subscribe({
      next: (servico) => {
        this.servicos.set([servico]);
        this.consultaAtiva.set(true);
        this.idConsultado.set(idItem);
        this.carregando.set(false);
      },
      error: (err) => {
        this.carregando.set(false);

        if (err?.status === 404) {
          this.servicos.set([]);
          this.consultaAtiva.set(true);
          this.idConsultado.set(idItem);
          this.messageService.openMessage(
            `Serviço com ID ${idItem} não encontrado.`,
            'Fechar',
            5000,
          );
          return;
        }

        this.messageService.openMessage(
          'Não foi possível consultar o serviço.',
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
    this.consultaAtiva.set(false);
    this.idConsultado.set(null);
    this.formBusca.reset();
    this.carregando.set(true);

    this.servicoService.getServicos().subscribe({
      next: (data: Servico[]) => {
        this.servicos.set(data);
        this.carregando.set(false);
      },
      error: (err) => {
        console.error('Erro ao buscar serviços:', err);
        this.carregando.set(false);
      },
    });
  }
}
