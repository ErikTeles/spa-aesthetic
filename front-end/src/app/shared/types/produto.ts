import { Categoria } from './categoria';

export interface Produto {
  idItem?: number;
  nomeItem: string;
  descricaoItem: string | null;
  preco: number;
  ativo: boolean;
  precoVenda: number;
  codigoPreco: number | null;
  unidade: string;
  quantidadeEstoque: number;
  categoria: Categoria;
}

export interface ProdutoRequest {
  nomeItem: string;
  idCategoria: number;
  descricaoItem: string | null;
  preco: number;
  ativo: boolean;
  precoVenda: number;
  codigoPreco: number | null;
  unidade: string;
}
