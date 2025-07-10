import { CategoriaStatus } from "../../enum/CategoriaStatusEnum";
import { CategoriaUsuarioDTO } from "../../Catalogo/dto/CategoriaUsuarioDTO";
import { CursoDTO } from "../../Catalogo/dto/CursoDTO";

export interface UsuarioResponseDTO {
  id: number;
  nome: string;
  cpf: string;
  ativo: CategoriaStatus;
  categoriaUsuario: CategoriaUsuarioDTO;
  curso: CursoDTO;
}