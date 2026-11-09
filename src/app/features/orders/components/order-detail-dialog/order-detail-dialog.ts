import { DecimalPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { PedidoCliente, PedidoClienteItem } from '../../../../shared/types/atendimento';

export interface OrderDetailDialogData {
  pedido: PedidoCliente;
}

@Component({
  selector: 'app-order-detail-dialog',
  imports: [DecimalPipe, MatButtonModule, MatDialogModule],
  templateUrl: './order-detail-dialog.html',
  styleUrl: './order-detail-dialog.css',
})
export class OrderDetailDialog {
  private readonly data = inject<OrderDetailDialogData>(MAT_DIALOG_DATA);

  public pedido = this.data.pedido;

  totalItem(item: PedidoClienteItem): number {
    return item.quantidadeItens * item.valorUnitarioEntrada;
  }

  totalPedido(): number {
    return this.pedido.itens.reduce((total, item) => total + this.totalItem(item), 0);
  }

  formatarData(dataAtendimento: string): string {
    return new Date(dataAtendimento).toLocaleString('pt-BR');
  }

  statusLabel(): string {
    return this.pedido.statusAtendimento === 'A'
      ? 'Em aberto'
      : this.pedido.statusAtendimento;
  }
}
