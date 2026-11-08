import { DecimalPipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { EntradaProdutoCreateDialog } from '../../components/entrada-produto-create-dialog/entrada-produto-create-dialog';
import { EntradaProdutoService } from '../../../../shared/services/entrada-produto-service';
import { EntradaProduto } from '../../../../shared/types/entrada-produto';

@Component({
  selector: 'app-admin-entrada-produtos',
  imports: [MatTableModule, MatIconModule, MatButtonModule, DecimalPipe],
  templateUrl: './admin-entrada-produtos.html',
  styleUrl: './admin-entrada-produtos.css',
})
export class AdminEntradaProdutos implements OnInit {
  private readonly entradaProdutoService = inject(EntradaProdutoService);
  private readonly dialog = inject(MatDialog);

  readonly entradas = signal<EntradaProduto[]>([]);
  readonly displayedColumns = [
    'idEntradaProduto',
    'produto',
    'dataEntradaProduto',
    'quantidadeEntrada',
    'unidade',
    'valorUnitarioEntrada',
    'valorTotal',
  ];

  ngOnInit(): void {
    this.carregarEntradas();
  }

  openCreateDialog(): void {
    this.dialog
      .open<EntradaProdutoCreateDialog, undefined, boolean>(EntradaProdutoCreateDialog, {
        width: '640px',
        autoFocus: 'first-tabbable',
      })
      .afterClosed()
      .subscribe((salvo) => {
        if (salvo) {
          this.carregarEntradas();
        }
      });
  }

  nomeProduto(entrada: EntradaProduto): string {
    return entrada.item1 ?? `Produto #${entrada.idItem}`;
  }

  formatarData(dataEntradaProduto: string): string {
    return new Date(dataEntradaProduto).toLocaleString('pt-BR');
  }

  totalEntrada(entrada: EntradaProduto): number {
    return entrada.quantidadeEntrada * entrada.valorUnitarioEntrada;
  }

  private carregarEntradas(): void {
    this.entradaProdutoService.getEntradasProduto().subscribe({
      next: (entradas) => this.entradas.set(entradas),
      error: (err) => console.error('Erro ao buscar entradas de produtos:', err),
    });
  }
}
