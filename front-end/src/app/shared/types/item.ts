import { Categoria } from './categoria';

export interface Item {
  idItem: number;
  nomeItem: string;
  descricaoItem: string | null;
  preco: number;
  ativo: boolean;
  tipoItem: string;
  categoria: Categoria;
  precoVenda: number | null;
  codigoPreco: number | null;
  unidade: string | null;
  quantidadeEstoque: number | null;
}
