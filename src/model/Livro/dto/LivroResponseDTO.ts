import { CategoriaLivroDTO } from "../../Catalogo/dto/CategoriaLivroDTO";

export interface LivroResponseDTO {
  id: number;
  titulo: string;
  autor: string;
  editora: string;
  edicao: string;
  isbn: string;
  categoriaLivro: CategoriaLivroDTO;
}
