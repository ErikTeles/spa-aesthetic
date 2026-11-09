import { Component, inject, OnInit, signal } from '@angular/core';
import { Pessoa } from '../../../../shared/types/pessoa';
import { PessoaService } from '../../../../shared/services/pessoa-service';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import {
  ClientEditDialog,
  ClientEditDialogData,
} from '../../components/client-edit-dialog/client-edit-dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-admin-clientes',
  imports: [MatTableModule, MatIconModule, MatButtonModule],
  templateUrl: './admin-clientes.html',
  styleUrl: './admin-clientes.css',
})
export class AdminClientes implements OnInit {
  private readonly pessoaService = inject(PessoaService);
  private readonly dialog = inject(MatDialog);

  readonly clients = signal<Pessoa[]>([]);
  readonly displayedColumns = ['cpf', 'nome', 'email', 'actions'];

  ngOnInit(): void {
    this.carregarClientes();
  }

  openEditDialog(cliente: Pessoa): void {
    this.dialog
      .open<ClientEditDialog, ClientEditDialogData, Pessoa>(ClientEditDialog, {
        data: { cliente },
        width: '560px',
        autoFocus: 'first-tabbable',
      })
      .afterClosed()
      .subscribe((atualizado) => {
        if (atualizado) {
          this.carregarClientes();
        }
      });
  }

  private carregarClientes(): void {
    this.pessoaService.getAllPessoas().subscribe({
      next: (data: Pessoa[]) => this.clients.set(data),
      error: (err) => console.error('Erro ao buscar clientes:', err),
    });
  }
}
