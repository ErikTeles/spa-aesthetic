import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { formatDate } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { CpfMaskDirective } from '../../../../shared/directives/cpf-mask';
import { CelularMaskDirective } from '../../../../shared/directives/celular-mask';
import { MessageService } from '../../../../shared/services/message-service';
import { PessoaService } from '../../../../shared/services/pessoa-service';
import { Pessoa } from '../../../../shared/types/pessoa';

export interface ClientEditDialogData {
  cliente: Pessoa;
}

@Component({
  selector: 'app-client-edit-dialog',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatButtonModule,
    MatSelectModule,
    CpfMaskDirective,
    CelularMaskDirective,
  ],
  templateUrl: './client-edit-dialog.html',
  styleUrl: './client-edit-dialog.css',
})
export class ClientEditDialog {
  private readonly data = inject<ClientEditDialogData>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<ClientEditDialog, Pessoa | undefined>);
  private readonly pessoaService = inject(PessoaService);
  private readonly messageService = inject(MessageService);

  readonly salvando = signal(false);

  readonly formPessoa = new FormGroup({
    nome: new FormControl('', [Validators.required]),
    cpf: new FormControl({ value: '', disabled: true }, [Validators.required]),
    dataNascimento: new FormControl<Date | null>(null, [Validators.required]),
    sexo: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    telefone: new FormControl('', [Validators.required]),
  });

  constructor() {
    const cliente = this.data.cliente;

    this.formPessoa.setValue({
      nome: cliente.nome ?? '',
      cpf: this.formatCpf(cliente.cpf ?? ''),
      dataNascimento: this.parseDate(cliente.dataNascimento),
      sexo: cliente.sexo ?? '',
      email: cliente.email ?? '',
      telefone: this.formatCelular(cliente.telefone ?? ''),
    });
  }

  salvar(): void {
    if (this.formPessoa.invalid || this.salvando()) {
      this.formPessoa.markAllAsTouched();
      return;
    }

    const pessoaValue = this.formPessoa.getRawValue();
    const pessoa: Pessoa = {
      idPessoa: this.data.cliente.idPessoa,
      nome: (pessoaValue.nome ?? '').trim(),
      cpf: this.onlyDigits(pessoaValue.cpf ?? ''),
      dataNascimento: formatDate(pessoaValue.dataNascimento!, 'yyyy-MM-dd', 'pt-BR'),
      sexo: pessoaValue.sexo ?? '',
      email: (pessoaValue.email ?? '').trim(),
      telefone: this.onlyDigits(pessoaValue.telefone ?? ''),
    };

    this.salvando.set(true);

    this.pessoaService.updatePessoa(pessoa).subscribe({
      next: () => {
        this.messageService.openMessage('Cliente atualizado com sucesso!');
        this.dialogRef.close(pessoa);
      },
      error: (err) => {
        this.salvando.set(false);

        const message = err?.error?.message ?? err?.error;

        this.messageService.openMessage(
          typeof message === 'string' && message
            ? message
            : 'Não foi possível atualizar o cliente.',
          'Fechar',
          5000,
        );
      },
    });
  }

  private parseDate(value: string | null | undefined): Date | null {
    if (!value) {
      return null;
    }

    const [date] = value.split('T');
    const [ano, mes, dia] = date.split('-').map(Number);

    if (!ano || !mes || !dia) {
      return null;
    }

    return new Date(ano, mes - 1, dia);
  }

  private formatCpf(value: string): string {
    return this.onlyDigits(value)
      .slice(0, 11)
      .replace(/^(\d{3})(\d)/, '$1.$2')
      .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3-$4');
  }

  private formatCelular(value: string): string {
    return this.onlyDigits(value)
      .slice(0, 11)
      .replace(/^(\d{2})(\d)/, '($1) $2')
      .replace(/^\((\d{2})\) (\d{5})(\d)/, '($1) $2-$3');
  }

  private onlyDigits(value: string): string {
    return value.replace(/\D/g, '');
  }
}
