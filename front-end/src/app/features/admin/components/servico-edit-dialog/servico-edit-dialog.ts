import { Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MessageService } from '../../../../shared/services/message-service';
import { ServicoService } from '../../../../shared/services/servico-service';
import { CategoriaService } from '../../../../shared/services/categoria-service';
import { Servico, ServicoRequest } from '../../../../shared/types/servico';
import { Categoria } from '../../../../shared/types/categoria';
import { Observable } from 'rxjs';

export interface ServicoEditDialogData {
  servico?: Servico;
}

@Component({
  selector: 'app-servico-edit-dialog',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
  ],
  templateUrl: './servico-edit-dialog.html',
  styleUrl: './servico-edit-dialog.css',
})
export class ServicoEditDialog implements OnInit {
  private readonly data = inject<ServicoEditDialogData>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<ServicoEditDialog, boolean | undefined>);
  private readonly servicoService = inject(ServicoService);
  private readonly categoriaService = inject(CategoriaService);
  private readonly messageService = inject(MessageService);

  readonly salvando = signal(false);
  readonly editando = !!this.data.servico;
  readonly categorias = signal<Categoria[]>([]);

  readonly formServico = new FormGroup({
    nomeItem: new FormControl('', [Validators.required, Validators.maxLength(40)]),
    idCategoria: new FormControl<number | null>(null, [Validators.required]),
    descricaoItem: new FormControl('', [Validators.maxLength(200)]),
    preco: new FormControl<number | null>(null, [Validators.required, Validators.min(0)]),
    ativo: new FormControl(true),
  });

  constructor() {
    const servico = this.data.servico;

    if (!servico) {
      return;
    }

    this.formServico.setValue({
      nomeItem: servico.nomeItem ?? '',
      idCategoria: servico.categoria?.idCategoria ?? null,
      descricaoItem: servico.descricaoItem ?? '',
      preco: servico.preco,
      ativo: servico.ativo,
    });
  }

  ngOnInit(): void {
    this.categoriaService.getAllCategorias().subscribe({
      next: (data: Categoria[]) => this.categorias.set(data),
      error: (err) => {
        console.error('Erro ao buscar categorias:', err);
        this.messageService.openMessage(
          'Não foi possível carregar as categorias.',
          'Fechar',
          5000,
        );
      },
    });
  }

  salvar(): void {
    if (this.formServico.invalid || this.salvando()) {
      this.formServico.markAllAsTouched();
      return;
    }

    const servicoValue = this.formServico.getRawValue();
    const servico: ServicoRequest = {
      nomeItem: (servicoValue.nomeItem ?? '').trim(),
      idCategoria: servicoValue.idCategoria!,
      descricaoItem: servicoValue.descricaoItem?.trim() || null,
      preco: servicoValue.preco ?? 0,
      ativo: servicoValue.ativo ?? true,
    };

    const idItem = this.data.servico?.idItem;

    this.salvando.set(true);

    const request$: Observable<unknown> =
      this.editando && idItem !== undefined
        ? this.servicoService.updateServico(idItem, servico)
        : this.servicoService.createServico(servico);

    request$.subscribe({
      next: () => {
        this.messageService.openMessage(
          this.editando
            ? 'Serviço atualizado com sucesso!'
            : 'Serviço cadastrado com sucesso!',
        );
        this.dialogRef.close(true);
      },
      error: (err) => {
        this.salvando.set(false);

        const message = err?.error?.message ?? err?.error;

        this.messageService.openMessage(
          typeof message === 'string' && message
            ? message
            : this.editando
              ? 'Não foi possível atualizar o serviço.'
              : 'Não foi possível cadastrar o serviço.',
          'Fechar',
          5000,
        );
      },
    });
  }
}
