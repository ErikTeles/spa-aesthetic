import { Component, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import {
  FuncionarioEditDialog,
  FuncionarioEditDialogData,
} from '../../components/funcionario-edit-dialog/funcionario-edit-dialog';
import { FuncionarioService } from '../../../../shared/services/funcionario-service';
import { MessageService } from '../../../../shared/services/message-service';
import { Funcionario } from '../../../../shared/types/funcionario';

@Component({
  selector: 'app-admin-funcionarios',
  imports: [MatTableModule, MatIconModule, MatButtonModule],
  templateUrl: './admin-funcionarios.html',
  styleUrl: './admin-funcionarios.css',
})
export class AdminFuncionarios implements OnInit {
  private readonly funcionarioService = inject(FuncionarioService);
  private readonly messageService = inject(MessageService);
  private readonly dialog = inject(MatDialog);

  readonly funcionarios = signal<Funcionario[]>([]);
  readonly displayedColumns = ['cpf', 'nome', 'email', 'cargo', 'dataAdmissao', 'actions'];

  ngOnInit(): void {
    this.carregarFuncionarios();
  }

  openCreateDialog(): void {
    this.abrirDialogo({});
  }

  openEditDialog(funcionario: Funcionario): void {
    this.abrirDialogo({ funcionario });
  }

  excluirFuncionario(funcionario: Funcionario): void {
    if (!funcionario.idFuncionario) {
      return;
    }

    if (!confirm(`Deseja excluir o funcionário ${funcionario.nome}?`)) {
      return;
    }

    this.funcionarioService.deleteFuncionario(funcionario.idFuncionario).subscribe({
      next: () => {
        this.messageService.openMessage('Funcionário excluído com sucesso!');
        this.carregarFuncionarios();
      },
      error: (err) => {
        const message = err?.error?.message ?? err?.error;

        this.messageService.openMessage(
          typeof message === 'string' && message
            ? message
            : 'Não foi possível excluir o funcionário.',
          'Fechar',
          5000,
        );
      },
    });
  }

  private abrirDialogo(data: FuncionarioEditDialogData): void {
    this.dialog
      .open<FuncionarioEditDialog, FuncionarioEditDialogData, Funcionario>(
        FuncionarioEditDialog,
        {
          data,
          width: '560px',
          autoFocus: 'first-tabbable',
        },
      )
      .afterClosed()
      .subscribe((atualizado) => {
        if (atualizado) {
          this.carregarFuncionarios();
        }
      });
  }

  formatarData(value: string): string {
    if (!value) {
      return '';
    }

    const [date] = value.split('T');
    const [ano, mes, dia] = date.split('-');

    if (!ano || !mes || !dia) {
      return value;
    }

    return `${dia}/${mes}/${ano}`;
  }

  private carregarFuncionarios(): void {
    this.funcionarioService.getAllFuncionarios().subscribe({
      next: (data: Funcionario[]) => this.funcionarios.set(data),
      error: (err) => console.error('Erro ao buscar funcionários:', err),
    });
  }
}
