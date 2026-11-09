export interface CheckoutItemRequest {
  idItem: number;
  quantidadeItens: number;
}

export interface CheckoutRequest {
  idPessoa: number;
  idFuncionario: number;
  itens: CheckoutItemRequest[];
}
