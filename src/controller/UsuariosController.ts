import {
    Body,
    Controller,
    Delete,
    Get,
    Path,
    Post,
    Put,
    Res,
    Route,
    Tags,
    TsoaResponse
} from "tsoa";

import { UsuarioService } from "../service/UsuarioService";
import { UsuarioRequestDTO } from "../model/Usuario/dto/UsuarioRequestDTO";
import { UsuarioResponseDTO } from "../model/Usuario/dto/UsuarioResponseDTO";
import { BasicResponseDto } from "../model/BasicResponseDTO";

@Route("usuario")
@Tags("Usuario")
export class UsuarioController extends Controller {
    private usuarioService = new UsuarioService();

    @Post()
    public async cadastrarUsuario(
        @Body() dto: UsuarioRequestDTO,
        @Res() fail: TsoaResponse<400, BasicResponseDto>,
        @Res() success: TsoaResponse<201, BasicResponseDto<UsuarioResponseDTO[]>>
    ): Promise<void> {
        try {
            const novoUsuario = await this.usuarioService.cadastrarUsuario(dto);
            return success(201, new BasicResponseDto("Usuário cadastrado com sucesso", novoUsuario));
        } catch (error: any) {
            return fail(400, new BasicResponseDto(error.message));
        }
    }

    @Get()
    public async listarUsuarios(
        @Res() fail: TsoaResponse<500, BasicResponseDto>,
        @Res() success: TsoaResponse<200, BasicResponseDto<UsuarioResponseDTO[]>>
    ): Promise<void> {
        try {
            const usuarios = await this.usuarioService.listarUsuarios({});
            return success(200, new BasicResponseDto("Usuários listados com sucesso", usuarios));
        } catch (error: any) {
            return fail(500, new BasicResponseDto(error.message));
        }
    }

    @Get("{cpf}")
    public async filtrarPorCPF(
        @Path() cpf: string,
        @Res() fail: TsoaResponse<404, BasicResponseDto>,
        @Res() success: TsoaResponse<200, BasicResponseDto<UsuarioResponseDTO>>
    ): Promise<void> {
        try {
            const usuarios = await this.usuarioService.listarUsuarios({ cpf });
            if (!usuarios.length) throw new Error("Usuário não encontrado");
            return success(200, new BasicResponseDto("Usuário encontrado", usuarios[0]));
        } catch (error: any) {
            return fail(404, new BasicResponseDto(error.message));
        }
    }

    @Put("{cpf}")
    public async atualizarUsuario(
        @Path() cpf: string,
        @Body() dto: UsuarioRequestDTO,
        @Res() fail: TsoaResponse<404, BasicResponseDto>,
        @Res() success: TsoaResponse<200, BasicResponseDto<UsuarioResponseDTO>>
    ): Promise<void> {
        try {
            await this.usuarioService.atualizarUsuario(cpf, dto);
            return success(200, new BasicResponseDto("Usuário atualizado com sucesso"));
        } catch (error: any) {
            return fail(404, new BasicResponseDto(error.message));
        }
    }

    @Delete("{cpf}")
    public async deletarUsuario(
        @Path() cpf: string,
        @Res() fail: TsoaResponse<404, BasicResponseDto>,
        @Res() success: TsoaResponse<204, BasicResponseDto>
    ): Promise<void> {
        try {
            await this.usuarioService.deletarUsuario(cpf);
            return success(204, new BasicResponseDto("Usuário deletado com sucesso"));
        } catch (error: any) {
            return fail(404, new BasicResponseDto(error.message));
        }
    }
}