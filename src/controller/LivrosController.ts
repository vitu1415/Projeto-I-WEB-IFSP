import {
  Body,
  Controller,
  Delete,
  Get,
  Path,
  Post,
  Put,
  Query,
  Res,
  Route,
  Tags,
  TsoaResponse,
} from "tsoa";

import { LivroService } from "../service/LivroService";
import { LivroRequestDTO } from "../model/Livro/dto/LivroRequestDTO";
import { LivroResponseDTO } from "../model/Livro/dto/LivroResponseDTO";
import { BasicResponseDto } from "../model/BasicResponseDTO";

@Route("livro")
@Tags("Livro")
export class LivroController extends Controller {
  private livroService = new LivroService();

  @Post()
  public async cadastrarLivro(
    @Body() dto: LivroRequestDTO,
    @Res() fail: TsoaResponse<400, BasicResponseDto>,
    @Res() success: TsoaResponse<201, BasicResponseDto<LivroResponseDTO[]>>
  ): Promise<void> {
    try {
      const novoLivro = await this.livroService.criarCadastrarLivro(dto);
      return success(201, new BasicResponseDto("Livro cadastrado com sucesso", novoLivro));
    } catch (error: any) {
      return fail(400, new BasicResponseDto(error.message));
    }
  }

  @Get()
  public async listarLivros(
    @Query() filtro: any = {},
    @Res() fail: TsoaResponse<500, BasicResponseDto>,
    @Res() success: TsoaResponse<200, BasicResponseDto<LivroResponseDTO[]>>
    ): Promise<void> {
    try {
      const livros = await this.livroService.listarLivros(filtro);
      return success(200, new BasicResponseDto("Livros listados com sucesso", livros));
    } catch (error: any) {
      return fail(500, new BasicResponseDto(error.message));
    }
  }

  @Get("{isbn}")
  public async detalhesLivro(
    @Path() isbn: string,
    @Res() fail: TsoaResponse<404, BasicResponseDto>,
    @Res() success: TsoaResponse<200, BasicResponseDto<LivroResponseDTO>>
  ): Promise<void> {
    try {
      const livros = await this.livroService.listarLivros({ isbn });
      if (!livros.length) throw new Error("Livro não encontrado");
      return success(200, new BasicResponseDto("Livro encontrado", livros[0]));
    } catch (error: any) {
      return fail(404, new BasicResponseDto(error.message));
    }
  }

  @Put("{isbn}")
  public async atualizarLivro(
    @Path() isbn: string,
    @Body() dto: LivroRequestDTO,
    @Res() fail: TsoaResponse<404, BasicResponseDto>,
    @Res() success: TsoaResponse<200, BasicResponseDto<LivroResponseDTO>>
  ): Promise<void> {
    try {
      await this.livroService.atualizarLivro(isbn, dto);
      return success(200, new BasicResponseDto("Livro atualizado com sucesso"));
    } catch (error: any) {
      return fail(404, new BasicResponseDto(error.message));
    }
  }

  @Delete("{isbn}")
  public async deletarLivro(
    @Path() isbn: string,
    @Res() fail: TsoaResponse<404, BasicResponseDto>,
    @Res() success: TsoaResponse<204, BasicResponseDto>
  ): Promise<void> {
    try {
      await this.livroService.removerLivro(isbn);
      return success(204, new BasicResponseDto("Livro deletado com sucesso"));
    } catch (error: any) {
      return fail(404, new BasicResponseDto(error.message));
    }
  }
}
