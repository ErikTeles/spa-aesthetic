export interface AtendimentoItem {
  idItem: number;
  idFuncionario: number;
  quantidadeItens: number;
  valorUnitarioEntrada: number;
}

export interface Atendimento {
  idAtendimento: number;
  idPessoa: number;
  dataAtendimento: string;
  statusAtendimento: string;
  itens: AtendimentoItem[];
}

export interface AtendimentoRequest {
  idPessoa: number;
  dataAtendimento: string;
  statusAtendimento: string;
}

export interface AtendimentoItemRequest {
  idItem: number;
  idFuncionario: number;
  quantidadeItens: number;
  valorUnitarioEntrada?: number | null;
}

export interface PedidoClienteItem {
  idItem: number;
  nomeItem: string;
  idFuncionario: number;
  funcionario: string;
  quantidadeItens: number;
  valorUnitarioEntrada: number;
}

export interface PedidoCliente {
  idAtendimento: number;
  dataAtendimento: string;
  statusAtendimento: string;
  itens: PedidoClienteItem[];
}
