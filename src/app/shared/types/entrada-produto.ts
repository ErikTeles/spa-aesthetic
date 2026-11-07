export interface EntradaProduto {
  idEntradaProduto: number;
  idItem: number;
  item1: string | null;
  dataEntradaProduto: string;
  quantidadeEntrada: number;
  unidade: string;
  valorUnitarioEntrada: number;
}

export interface EntradaProdutoRequest {
  idItem: number;
  dataEntradaProduto: string;
  quantidadeEntrada: number;
  unidade: string;
  valorUnitarioEntrada: number;
}
