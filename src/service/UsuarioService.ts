import { CategoriaStatus } from "../model/CategoriaStatusEnum";
import { Usuario } from "../model/Usuario";
import { UsuarioRepository } from "../repository/UsuarioRepository";
import { CategoriaUsuarioService } from "./CategoriaUsuarioService";
import { CursoService } from "./CursoService";
import { EmmprestimoService } from "./EmprestimoService";
import { FormatadorDate } from "./FormatadorDate";

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

        return digito1 === cpfArray[9] && digito2 === cpfArray[10];
    }

    cadastrarUsuario(usuarioData: any): Usuario {
        const { nome, cpf, } = usuarioData;
        let { categoriaUsuario, curso } = usuarioData
        const ativo: CategoriaStatus = CategoriaStatus.ATIVO;
        if (!nome || !cpf || !categoriaUsuario || !curso) {
            throw new Error("esta faltando dados que sao obrigatorios");
        }
        if (!this.ValidarCPF(cpf)) {
            throw new Error("CPF invalido");
        }

        const usuarioExistente = this.repository.listar().find(u => u.cpf === cpf);
        if (usuarioExistente) {
            throw new Error("CPF ja cadastrado");
        }

        categoriaUsuario = this.categoriaUsuarioService.listarPorFiltro(categoriaUsuario);
        if (!categoriaUsuario) {
            throw new Error("Categoria Usuario nao encontrada");
        }

        curso = this.cursoSerivce.listarPorFiltro(curso);
        if (!curso) {
            throw new Error("Curso nao encontrado");
        }

        const usuario = new Usuario(nome, cpf, ativo, categoriaUsuario, curso);
        this.repository.cadastrar(usuario);
        return usuario;
    }

    listarUsuarios(usuarioData: any): Usuario[] {
        return this.repository.filtrarPorCampos(usuarioData);
    }

    buscarUsuario(cpf: any): Usuario {
        return this.repository.findByCPF(cpf);
    }

    atualizarUsuario(cpf: any, usuarioData: any): Usuario[] {
        let { ativo, categoriaLivro, curso } = usuarioData;
        if (categoriaLivro) {
            categoriaLivro = this.categoriaUsuarioService.listarPorFiltro(categoriaLivro.id);
            if (!categoriaLivro) {
                throw new Error("Categoria Usuario nao encontrada");
            }
            usuarioData.categoriaUsuario = categoriaLivro;
        }
        if (ativo !== "ATIVO" && ativo !== "INATIVO" && ativo !== "SUSPENSO") {
            throw new Error("Categoria Usuario nao encontrada");
        } else {
            usuarioData.ativo = ativo;
        }
        if (curso) {
            curso = this.cursoSerivce.listarPorFiltro(curso.id);
            if (!curso) {
                throw new Error("Curso nao encontrado");
            }
            usuarioData.curso = curso;
        }
        return this.repository.atualizar(cpf, usuarioData);
    }

    deletarUsuario(cpf: any): void {
        const serviceEmprestimo = new EmmprestimoService();
        const resultado = serviceEmprestimo.listarEmprestimoPorUsuario(cpf);
        let resultado_final = resultado.find(e => e.dataDevolucao === null);
        if (resultado_final !== undefined) {
            throw new Error("Usuario possui emprestimos em aberto, nao e possivel remover");
        }
        return this.repository.remover(cpf);
    }

    reativarUsuariosSuspensos() {
        const serviceEmprestimo = new EmmprestimoService();
        const usuarios = this.repository.listar();

        const hoje = new Date();

        usuarios.forEach(usuario => {
            if (usuario.ativo !== CategoriaStatus.ATIVO && usuario.ativo !== CategoriaStatus.INATIVO) {
                const emprestimos = serviceEmprestimo.listarEmprestimoPorUsuario(usuario.cpf);

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
        });
    }

}