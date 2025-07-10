import { CategoriaStatus } from "../../enum/CategoriaStatusEnum";

export interface UsuarioRequestDTO {
  nome: string;
  cpf: string;
  ativo: CategoriaStatus;
  categoriaUsuarioId: number;
  cursoId: number;
}