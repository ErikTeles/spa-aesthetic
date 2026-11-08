import { Categoria } from './categoria';

export interface Servico {
  idItem?: number;
  nomeItem: string;
  descricaoItem: string | null;
  preco: number;
  ativo: boolean;
  categoria: Categoria;
}

export interface ServicoRequest {
  nomeItem: string;
  idCategoria: number;
  descricaoItem: string | null;
  preco: number;
  ativo: boolean;
}
