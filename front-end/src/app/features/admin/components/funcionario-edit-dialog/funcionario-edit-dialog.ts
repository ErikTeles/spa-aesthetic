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
import { FuncionarioService } from '../../../../shared/services/funcionario-service';
import { Funcionario } from '../../../../shared/types/funcionario';
import { Observable } from 'rxjs';

export interface FuncionarioEditDialogData {
  funcionario?: Funcionario;
}

@Component({
  selector: 'app-funcionario-edit-dialog',
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
  templateUrl: './funcionario-edit-dialog.html',
  styleUrl: './funcionario-edit-dialog.css',
})
export class FuncionarioEditDialog {
  private readonly data = inject<FuncionarioEditDialogData>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(
    MatDialogRef<FuncionarioEditDialog, Funcionario | undefined>,
  );
  private readonly funcionarioService = inject(FuncionarioService);
  private readonly messageService = inject(MessageService);

  readonly salvando = signal(false);
  readonly editando = !!this.data.funcionario;

  readonly formFuncionario = new FormGroup({
    nome: new FormControl('', [Validators.required]),
    cpf: new FormControl('', [Validators.required]),
    dataNascimento: new FormControl<Date | null>(null, [Validators.required]),
    sexo: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    telefone: new FormControl('', [Validators.required]),
    cargo: new FormControl('', [Validators.required]),
    dataAdmissao: new FormControl<Date | null>(null, [Validators.required]),
  });

  constructor() {
    const funcionario = this.data.funcionario;

    if (!funcionario) {
      return;
    }

    this.formFuncionario.setValue({
      nome: funcionario.nome ?? '',
      cpf: this.formatCpf(funcionario.cpf ?? ''),
      dataNascimento: this.parseDate(funcionario.dataNascimento),
      sexo: funcionario.sexo ?? '',
      email: funcionario.email ?? '',
      telefone: this.formatCelular(funcionario.telefone ?? ''),
      cargo: funcionario.cargo ?? '',
      dataAdmissao: this.parseDate(funcionario.dataAdmissao),
    });

    this.formFuncionario.controls.cpf.disable();
  }

  salvar(): void {
    if (this.formFuncionario.invalid || this.salvando()) {
      this.formFuncionario.markAllAsTouched();
      return;
    }

    const funcionarioValue = this.formFuncionario.getRawValue();
    const funcionario: Funcionario = {
      idFuncionario: this.data.funcionario?.idFuncionario,
      nome: (funcionarioValue.nome ?? '').trim(),
      cpf: this.onlyDigits(funcionarioValue.cpf ?? ''),
      dataNascimento: formatDate(funcionarioValue.dataNascimento!, 'yyyy-MM-dd', 'pt-BR'),
      sexo: funcionarioValue.sexo ?? '',
      email: (funcionarioValue.email ?? '').trim(),
      telefone: this.onlyDigits(funcionarioValue.telefone ?? ''),
      cargo: (funcionarioValue.cargo ?? '').trim(),
      dataAdmissao: formatDate(funcionarioValue.dataAdmissao!, 'yyyy-MM-dd', 'pt-BR'),
    };

    this.salvando.set(true);

    const request$: Observable<unknown> = this.editando
      ? this.funcionarioService.updateFuncionario(funcionario)
      : this.funcionarioService.createFuncionario(funcionario);

    request$.subscribe({
      next: () => {
        this.messageService.openMessage(
          this.editando
            ? 'Funcionário atualizado com sucesso!'
            : 'Funcionário cadastrado com sucesso!',
        );
        this.dialogRef.close(funcionario);
      },
      error: (err) => {
        this.salvando.set(false);

        const message = err?.error?.message ?? err?.error;

        this.messageService.openMessage(
          typeof message === 'string' && message
            ? message
            : this.editando
              ? 'Não foi possível atualizar o funcionário.'
              : 'Não foi possível cadastrar o funcionário.',
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
