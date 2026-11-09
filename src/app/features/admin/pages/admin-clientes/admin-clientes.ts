import { Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import {
  ClientEditDialog,
  ClientEditDialogData,
} from '../../components/client-edit-dialog/client-edit-dialog';
import { MessageService } from '../../../../shared/services/message-service';
import { PessoaService } from '../../../../shared/services/pessoa-service';
import { Pessoa } from '../../../../shared/types/pessoa';

@Component({
  selector: 'app-admin-clientes',
  imports: [
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  templateUrl: './admin-clientes.html',
  styleUrl: './admin-clientes.css',
})
export class AdminClientes implements OnInit {
  private readonly pessoaService = inject(PessoaService);
  private readonly messageService = inject(MessageService);
  private readonly dialog = inject(MatDialog);

  readonly clients = signal<Pessoa[]>([]);
  readonly carregando = signal(true);
  readonly consultaAtiva = signal(false);
  readonly idConsultado = signal<number | null>(null);
  readonly displayedColumns = ['idPessoa', 'cpf', 'nome', 'email', 'actions'];

  readonly formBusca = new FormGroup({
    idPessoa: new FormControl<number | null>(null, [Validators.required, Validators.min(1)]),
  });

  ngOnInit(): void {
    this.carregarClientes();
  }

  buscarPorId(): void {
    if (this.formBusca.invalid) {
      this.formBusca.markAllAsTouched();
      return;
    }

    const idPessoa = this.formBusca.controls.idPessoa.value;

    if (!idPessoa || !Number.isInteger(idPessoa)) {
      this.messageService.openMessage('Informe um ID válido.', 'Fechar', 5000);
      return;
    }

    this.carregando.set(true);

    this.pessoaService.getPessoaById(idPessoa).subscribe({
      next: (cliente) => {
        this.clients.set([cliente]);
        this.consultaAtiva.set(true);
        this.idConsultado.set(idPessoa);
        this.carregando.set(false);
      },
      error: (err) => {
        this.carregando.set(false);

        if (err?.status === 404) {
          this.clients.set([]);
          this.consultaAtiva.set(true);
          this.idConsultado.set(idPessoa);
          this.messageService.openMessage(
            `Cliente com ID ${idPessoa} não encontrado.`,
            'Fechar',
            5000,
          );
          return;
        }

        this.messageService.openMessage(
          'Não foi possível consultar o cliente.',
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
    this.consultaAtiva.set(false);
    this.idConsultado.set(null);
    this.formBusca.reset();
    this.carregando.set(true);

    this.pessoaService.getAllPessoas().subscribe({
      next: (data: Pessoa[]) => {
        this.clients.set(data);
        this.carregando.set(false);
      },
      error: (err) => {
        console.error('Erro ao buscar clientes:', err);
        this.carregando.set(false);
      },
    });
  }
}
