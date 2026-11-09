import { Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import {
  CategoriaEditDialog,
  CategoriaEditDialogData,
} from '../../components/categoria-edit-dialog/categoria-edit-dialog';
import { CategoriaService } from '../../../../shared/services/categoria-service';
import { MessageService } from '../../../../shared/services/message-service';
import { Categoria } from '../../../../shared/types/categoria';

@Component({
  selector: 'app-admin-categorias',
  imports: [
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  templateUrl: './admin-categorias.html',
  styleUrl: './admin-categorias.css',
})
export class AdminCategorias implements OnInit {
  private readonly categoriaService = inject(CategoriaService);
  private readonly messageService = inject(MessageService);
  private readonly dialog = inject(MatDialog);

  readonly categorias = signal<Categoria[]>([]);
  readonly carregando = signal(true);
  readonly consultaAtiva = signal(false);
  readonly idConsultado = signal<number | null>(null);
  readonly displayedColumns = ['idCategoria', 'descricao', 'actions'];

  readonly formBusca = new FormGroup({
    idCategoria: new FormControl<number | null>(null, [
      Validators.required,
      Validators.min(1),
    ]),
  });

  ngOnInit(): void {
    this.carregarCategorias();
  }

  buscarPorId(): void {
    if (this.formBusca.invalid) {
      this.formBusca.markAllAsTouched();
      return;
    }

    const idCategoria = this.formBusca.controls.idCategoria.value;

    if (!idCategoria || !Number.isInteger(idCategoria)) {
      this.messageService.openMessage('Informe um ID válido.', 'Fechar', 5000);
      return;
    }

    this.carregando.set(true);

    this.categoriaService.getCategoriaById(idCategoria).subscribe({
      next: (categoria) => {
        this.categorias.set([categoria]);
        this.consultaAtiva.set(true);
        this.idConsultado.set(idCategoria);
        this.carregando.set(false);
      },
      error: (err) => {
        this.carregando.set(false);

        if (err?.status === 404) {
          this.categorias.set([]);
          this.consultaAtiva.set(true);
          this.idConsultado.set(idCategoria);
          this.messageService.openMessage(
            `Categoria com ID ${idCategoria} não encontrada.`,
            'Fechar',
            5000,
          );
          return;
        }

        this.messageService.openMessage(
          'Não foi possível consultar a categoria.',
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
    this.carregarCategorias();
  }

  openCreateDialog(): void {
    this.abrirDialogo({});
  }

  openEditDialog(categoria: Categoria): void {
    this.abrirDialogo({ categoria });
  }

  excluirCategoria(categoria: Categoria): void {
    if (!categoria.idCategoria) {
      return;
    }

    if (!confirm(`Deseja excluir a categoria ${categoria.descricao}?`)) {
      return;
    }

    this.categoriaService.deleteCategoria(categoria.idCategoria).subscribe({
      next: () => {
        this.messageService.openMessage('Categoria excluída com sucesso!');
        this.carregarCategorias();
      },
      error: (err) => {
        const message = err?.error?.message ?? err?.error;

        this.messageService.openMessage(
          typeof message === 'string' && message
            ? message
            : 'Não foi possível excluir a categoria.',
          'Fechar',
          5000,
        );
      },
    });
  }

  private abrirDialogo(data: CategoriaEditDialogData): void {
    this.dialog
      .open<CategoriaEditDialog, CategoriaEditDialogData, Categoria>(CategoriaEditDialog, {
        data,
        width: '560px',
        autoFocus: 'first-tabbable',
      })
      .afterClosed()
      .subscribe((atualizada) => {
        if (atualizada) {
          this.carregarCategorias();
        }
      });
  }

  private carregarCategorias(): void {
    this.consultaAtiva.set(false);
    this.idConsultado.set(null);
    this.formBusca.reset();
    this.carregando.set(true);

    this.categoriaService.getAllCategorias().subscribe({
      next: (data: Categoria[]) => {
        this.categorias.set(data);
        this.carregando.set(false);
      },
      error: (err) => {
        console.error('Erro ao buscar categorias:', err);
        this.carregando.set(false);
      },
    });
  }
}
