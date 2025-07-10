import { CategoriaStatus } from "../model/enum/CategoriaStatusEnum";
import { Usuario } from "../model/Usuario/Entity/UsuarioEntity";
import { UsuarioResponseDTO } from "../model/Usuario/dto/UsuarioResponseDTO";
import { UsuarioRepository } from "../repository/UsuarioRepository";
import { CategoriaUsuarioService } from "./CategoriaUsuarioService";
import { CursoService } from "./CursoService";
import { EmprestimoService } from "./EmprestimoService";
import { FormatadorDate } from "../Utils/FormatadorDate";

export class UsuarioService {
    private repository = UsuarioRepository.getInstance();
    private categoriaUsuarioService = new CategoriaUsuarioService();
    private cursoSerivce = new CursoService();
    private formatadorData = new FormatadorDate();

    calcularDigitoCPF(cpfParcial: number[], fator: number): number {
        let soma = 0;
        for (let i = 0; i < cpfParcial.length; i++) {
            soma += cpfParcial[i] * (fator - i);
        }

        const resto = soma % 11;
        return resto < 2 ? 0 : 11 - resto;
    }

    ValidarCPF(cpf: string): boolean {
        let sequenciaRepetida = new Set(cpf).size === 1;
        if (cpf.length != 11 || sequenciaRepetida) {
            return false;
        }
        const cpfArray = cpf.split('').map(Number);

        const digito1 = this.calcularDigitoCPF(cpfArray.slice(0, 9), 10);
        const digito2 = this.calcularDigitoCPF(cpfArray.slice(0, 10), 11);

        const resultado: boolean = cpfArray[9] === digito1 && cpfArray[10] === digito2;

        return resultado;
    }

    async cadastrarUsuario(usuarioData: any): Promise<UsuarioResponseDTO[]> {
        const { nome, cpf, } = usuarioData;
        let { categoriaUsuario, curso } = usuarioData
        const ativo: CategoriaStatus = CategoriaStatus.ATIVO;
        if (!nome || !cpf || !categoriaUsuario || !curso) {
            throw new Error("esta faltando dados que sao obrigatorios");
        }

        if (!this.ValidarCPF(cpf)) {
            throw new Error("CPF invalido");
        }

        const usuarioExistente = await this.repository.filtrarPorCampos({ cpf });
        if (usuarioExistente.length > 0) {
            throw new Error("CPF ja cadastrado");
        }

        categoriaUsuario = await this.categoriaUsuarioService.listarPorFiltro(categoriaUsuario);
        if (!categoriaUsuario) {
            throw new Error("Categoria Usuario nao encontrada");
        }

        curso = await this.cursoSerivce.listarPorFiltro(curso);
        if (!curso) {
            throw new Error("Curso nao encontrado");
        }

        const usuario = new Usuario(nome, cpf, ativo, categoriaUsuario[0].id, curso[0].id);
        const resultado: any = await this.repository.cadastrar(usuario);
        return await this.listarUsuarios({ id: resultado.insertId });
    }

    async listarUsuarios(usuarioData: any): Promise<any[]> {
        let usuarios: Usuario[];

        if (usuarioData === undefined || Object.keys(usuarioData).length === 0) {
            usuarios = await this.repository.listar();
        } else {
            usuarios = await this.repository.filtrarPorCampos(usuarioData);
        }

        const usuariosCompletos = await Promise.all(
            usuarios.map(async (u) => {
                const categoria = await this.categoriaUsuarioService.listarPorFiltro(u.categoriaUsuario);
                const curso = await this.cursoSerivce.listarPorFiltro(u.curso);

                return {
                    id: u.id,
                    nome: u.nome,
                    cpf: u.cpf,
                    ativo: u.ativo,
                    categoriaUsuario: {
                        id: categoria[0].id,
                        nome: categoria[0].nome
                    },
                    curso: {
                        id: curso[0].id,
                        nome: curso[0].nome
                    }
                };
            })
        );

        return usuariosCompletos;

    }

    buscarUsuario(cpf: any): Promise<Usuario> {
        return this.repository.findByCPF(cpf);
    }

    async atualizarUsuario(cpf: any, usuarioData: any): Promise<void> {
        let { ativo, categoriaLivro, curso } = usuarioData;
        if (categoriaLivro) {
            categoriaLivro = await this.categoriaUsuarioService.listarPorFiltro(categoriaLivro.id);
            if (!categoriaLivro) {
                throw new Error("Categoria Usuario nao encontrada");
            }
            usuarioData.categoriaUsuario = categoriaLivro;
        }
        if (ativo) {
            if (ativo !== "ATIVO" && ativo !== "INATIVO" && ativo !== "SUSPENSO") {
                throw new Error("Categoria Usuario nao encontrada");
            } else {
                usuarioData.ativo = ativo;
            }
        }
        if (curso) {
            curso = await this.cursoSerivce.listarPorFiltro(curso.id);
            if (!curso) {
                throw new Error("Curso nao encontrado");
            }
            usuarioData.curso = curso;
        }
        return await this.repository.atualizar(cpf, usuarioData);
    }

    async deletarUsuario(cpf: any): Promise<void> {
        const serviceEmprestimo = new EmprestimoService();
        const resultado = await serviceEmprestimo.listarEmprestimoPorUsuario(cpf);
        let resultado_final = resultado.find(e => e.dataDevolucao === null);
        if (resultado_final !== undefined) {
            throw new Error("Usuario possui emprestimos em aberto, nao e possivel remover");
        }
        return this.repository.remover(cpf);
    }

    async reativarUsuariosSuspensos() {
        const serviceEmprestimo = new EmprestimoService();
        const usuarios = await this.repository.listarUsuariosSuspensos();

        const hoje = new Date();

        for (const usuario of usuarios) {
            const emprestimos = await serviceEmprestimo.listarEmprestimoPorUsuario(usuario.cpf);

            const suspensoes = emprestimos
                .filter(e => e.suspensaoAte !== null && new Date(e.suspensaoAte) <= hoje);

            const temAtrasoGraveAtual = emprestimos
                .some(e => e.dataDevolucao === null &&
                    this.formatadorData.diferencaEmDias(hoje, e.dataEntrega) > 20);

            if (suspensoes.length > 0 && !temAtrasoGraveAtual) {
                usuario.ativo = CategoriaStatus.ATIVO;
                this.atualizarUsuario(usuario.cpf, usuario);
            }
        }
    };
}