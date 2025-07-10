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

import { EstoqueRequestDTO } from "../model/Estoque/dto/EstoqueRequestDTO";
import { EstoqueResponseDTO } from "../model/Estoque/dto/EstoqueResponseDTO";
import { LivroResponseDTO } from "../model/Livro/dto/LivroResponseDTO";
import { BasicResponseDto } from "../model/BasicResponseDTO";
import { EstoqueService } from "../service/EstoqueService";

@Route("estoque")
@Tags("Estoque")
export class EstoqueController extends Controller {
    private estoqueService = new EstoqueService();

    @Post()
    public async cadastroExemplar(
        @Body() dto: EstoqueRequestDTO,
        @Res() fail: TsoaResponse<400, BasicResponseDto>,
        @Res() success: TsoaResponse<201, BasicResponseDto<EstoqueResponseDTO[]>>
    ): Promise<void> {
        try {
            const novoExemplar = await this.estoqueService.cadastrarEstoque(dto);
            return success(201, new BasicResponseDto("Exemplar cadastrado com sucesso", novoExemplar));
        } catch (error: any) {
            return fail(400, new BasicResponseDto(error.message));
        }
    }

    @Get()
    public async listarExemplaresDisponiveis(
        @Res() fail: TsoaResponse<500, BasicResponseDto>,
        @Res() success: TsoaResponse<200, BasicResponseDto<EstoqueResponseDTO[]>>
    ): Promise<void> {
        try {
            const exemplares = await this.estoqueService.listarEstoqueDisponivel();
            return success(200, new BasicResponseDto("Exemplares listados com sucesso", exemplares));
        } catch (error: any) {
            return fail(500, new BasicResponseDto(error.message));
        }
    }

    @Get("{id}")
    public async listarDetalhesExemplar(
        @Path() id: number,
        @Res() fail: TsoaResponse<404, BasicResponseDto>,
        @Res() success: TsoaResponse<200, BasicResponseDto<LivroResponseDTO[]>>
    ): Promise<void> {
        try {
            const exemplar = await this.estoqueService.buscarExplarEmEstoque(id);
            return success(200, new BasicResponseDto("Exemplar encontrado", exemplar));
        } catch (error: any) {
            return fail(404, new BasicResponseDto(error.message));
        }
    }

    @Put("{id}")
    public async atualizarDisponibilidade(
        @Path() id: number,
        @Body() dto: Partial<EstoqueRequestDTO>,
        @Res() fail: TsoaResponse<404, BasicResponseDto>,
        @Res() success: TsoaResponse<200, BasicResponseDto<EstoqueResponseDTO>>
    ): Promise<void> {
        try {
            await this.estoqueService.atualizarDisponibilidadeManualmente(id, dto);
            return success(200, new BasicResponseDto("Exemplar atualizado com sucesso"));
        } catch (error: any) {
            return fail(404, new BasicResponseDto(error.message));
        }
    }

    @Delete("{id}")
    public async deletarExemplar(
        @Path() id: number,
        @Res() fail: TsoaResponse<404, BasicResponseDto>,
        @Res() success: TsoaResponse<204, BasicResponseDto>
    ): Promise<void> {
        try {
            await this.estoqueService.deletarEstoque(id);
            return success(204, new BasicResponseDto("Exemplar deletado com sucesso"));
        } catch (error: any) {
            return fail(404, new BasicResponseDto(error.message));
        }
    }
}