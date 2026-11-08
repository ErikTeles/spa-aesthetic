import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MessageService } from '../../../../shared/services/message-service';
import { CategoriaService } from '../../../../shared/services/categoria-service';
import { Categoria } from '../../../../shared/types/categoria';
import { Observable } from 'rxjs';

export interface CategoriaEditDialogData {
  categoria?: Categoria;
}

@Component({
  selector: 'app-categoria-edit-dialog',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './categoria-edit-dialog.html',
  styleUrl: './categoria-edit-dialog.css',
})
export class CategoriaEditDialog {
  private readonly data = inject<CategoriaEditDialogData>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<CategoriaEditDialog, Categoria | undefined>);
  private readonly categoriaService = inject(CategoriaService);
  private readonly messageService = inject(MessageService);

  readonly salvando = signal(false);
  readonly editando = !!this.data.categoria;

  readonly formCategoria = new FormGroup({
    descricao: new FormControl('', [Validators.required]),
  });

  constructor() {
    const categoria = this.data.categoria;

    if (!categoria) {
      return;
    }

    this.formCategoria.setValue({
      descricao: categoria.descricao ?? '',
    });
  }

  salvar(): void {
    if (this.formCategoria.invalid || this.salvando()) {
      this.formCategoria.markAllAsTouched();
      return;
    }

    const categoria: Categoria = {
      idCategoria: this.data.categoria?.idCategoria,
      descricao: (this.formCategoria.getRawValue().descricao ?? '').trim(),
    };

    this.salvando.set(true);

    const request$: Observable<unknown> = this.editando
      ? this.categoriaService.updateCategoria(categoria)
      : this.categoriaService.createCategoria(categoria);

    request$.subscribe({
      next: () => {
        this.messageService.openMessage(
          this.editando
            ? 'Categoria atualizada com sucesso!'
            : 'Categoria cadastrada com sucesso!',
        );
        this.dialogRef.close(categoria);
      },
      error: (err) => {
        this.salvando.set(false);

        const message = err?.error?.message ?? err?.error;

        this.messageService.openMessage(
          typeof message === 'string' && message
            ? message
            : this.editando
              ? 'Não foi possível atualizar a categoria.'
              : 'Não foi possível cadastrar a categoria.',
          'Fechar',
          5000,
        );
      },
    });
  }
}
