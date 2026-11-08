import { Component, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
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
  imports: [MatTableModule, MatIconModule, MatButtonModule],
  templateUrl: './admin-categorias.html',
  styleUrl: './admin-categorias.css',
})
export class AdminCategorias implements OnInit {
  private readonly categoriaService = inject(CategoriaService);
  private readonly messageService = inject(MessageService);
  private readonly dialog = inject(MatDialog);

  readonly categorias = signal<Categoria[]>([]);
  readonly displayedColumns = ['idCategoria', 'descricao', 'actions'];

  ngOnInit(): void {
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
    this.categoriaService.getAllCategorias().subscribe({
      next: (data: Categoria[]) => this.categorias.set(data),
      error: (err) => console.error('Erro ao buscar categorias:', err),
    });
  }
}
