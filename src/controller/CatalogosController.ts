import {
  Controller,
  Get,
  Route,
  Tags,
  Res,
  TsoaResponse
} from "tsoa";

import { CategoriaUsuarioService } from "../service/CategoriaUsuarioService";
import { CategoriaLivroService } from "../service/CategoriaLivroService";
import { CursoService } from "../service/CursoService";

import { CategoriaUsuarioDTO } from "../model/Catalogo/dto/CategoriaUsuarioDTO";
import { CategoriaLivroDTO } from "../model/Catalogo/dto/CategoriaLivroDTO";
import { CursoDTO } from "../model/Catalogo/dto/CursoDTO";
import { BasicResponseDto } from "../model/BasicResponseDTO";

@Route("categorias")
@Tags("Categorias")
export class CategoriaController extends Controller {

  @Get("/usuarios")
  public async listarCategoriaDeUsuario(
    @Res() fail: TsoaResponse<500, BasicResponseDto>,
    @Res() success: TsoaResponse<200, BasicResponseDto<CategoriaUsuarioDTO[]>>
  ): Promise<void> {
    try {
      const service = new CategoriaUsuarioService();
      const categorias = await service.listar();
      const dtos: CategoriaUsuarioDTO[] = categorias.map(c => ({ id: c.id, nome: c.nome }));
      return success(200, new BasicResponseDto("Categorias de usuário listadas com sucesso", dtos));
    } catch (error: any) {
      return fail(500, new BasicResponseDto("Erro ao buscar categorias de usuários", error.message));
    }
  }

  @Get("/livros")
  public async listarCategoriaLivro(
    @Res() fail: TsoaResponse<500, BasicResponseDto>,
    @Res() success: TsoaResponse<200, BasicResponseDto<CategoriaLivroDTO[]>>
  ): Promise<void> {
    try {
      const service = new CategoriaLivroService();
      const categorias = await service.listar();
      const dtos: CategoriaLivroDTO[] = categorias.map(c => ({ id: c.id, nome: c.nome }));
      return success(200, new BasicResponseDto("Categorias de livros listadas com sucesso", dtos));
    } catch (error: any) {
      return fail(500, new BasicResponseDto("Erro ao buscar categorias de livros", error.message));
    }
  }

  @Get("/cursos")
  public async listarTiposDeCursos(
    @Res() fail: TsoaResponse<500, BasicResponseDto>,
    @Res() success: TsoaResponse<200, BasicResponseDto<CursoDTO[]>>
  ): Promise<void> {
    try {
      const service = new CursoService();
      const cursos = await service.listar();
      const dtos: CursoDTO[] = cursos.map(c => ({ id: c.id, nome: c.nome }));
      return success(200, new BasicResponseDto("Tipos de curso listados com sucesso", dtos));
    } catch (error: any) {
      return fail(500, new BasicResponseDto("Erro ao buscar tipos de curso", error.message));
    }
  }
}
