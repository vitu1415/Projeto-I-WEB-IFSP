import {
    Body,
    Controller,
    Get,
    Path,
    Post,
    Put,
    Res,
    Route,
    Tags,
    TsoaResponse,
} from "tsoa";
import { EmprestimoRequestDTO } from "../model/Emprestimo/dto/EmprestimoRequestDTO";
import { EmprestimoResponseDTO } from "../model/Emprestimo/dto/EmprestimoResponseDTO";
import { EmprestimoService } from "../service/EmprestimoService";
import { BasicResponseDto } from "../model/BasicResponseDTO";

@Route("emprestimos")
@Tags("Emprestimos")
export class EmprestimoController extends Controller {
    private emprestimoService = new EmprestimoService();

    @Post()
    public async cadastrarEmprestimo(
        @Body() dto: EmprestimoRequestDTO,
        @Res() fail: TsoaResponse<400, BasicResponseDto>,
        @Res() success: TsoaResponse<201, BasicResponseDto<EmprestimoResponseDTO[]>>
    ): Promise<void> {
        try {
            const novoEmprestimo = await this.emprestimoService.cadastrarEmprestimo(dto);
            return success(
                201,
                new BasicResponseDto("Empréstimo cadastrado com sucesso", novoEmprestimo)
            );
        } catch (error: any) {
            return fail(400, new BasicResponseDto(error.message));
        }
    }

    @Get()
    public async listarEmprestimos(
        @Res() fail: TsoaResponse<500, BasicResponseDto>,
        @Res() success: TsoaResponse<200, BasicResponseDto<EmprestimoResponseDTO[]>>
    ): Promise<void> {
        try {
            const emprestimos = await this.emprestimoService.listarTodosEmprestimos();
            return success(200, new BasicResponseDto("Empréstimos listados com sucesso", emprestimos));
        } catch (error: any) {
            return fail(500, new BasicResponseDto(error.message));
        }
    }

    @Put("{id}/devolucao")
    public async registrarDevolucao(
        @Path() id: string,
        @Res() fail: TsoaResponse<404, BasicResponseDto>,
        @Res() success: TsoaResponse<200, BasicResponseDto<EmprestimoResponseDTO>>
    ): Promise<void> {
        try {
            await this.emprestimoService.devolucaoEmprestimo(id);
            return success(
                200,
                new BasicResponseDto("Devolução registrada com sucesso")
            );
        } catch (error: any) {
            return fail(404, new BasicResponseDto(error.message));
        }
    }
}
