import { Emprestimo } from "../model/Emprestimo";
import { Estoque } from "../model/Estoque";
import { EmprestimoRepository } from "../repository/EmprestimoRepository";
import { EstoqueService } from "./EstoqueService";
import { FormatadorDate } from "./FormatadorDate";
import { UsuarioService } from "./UsuarioService";
export class EmmprestimoService {
    private repository = EmprestimoRepository.getInstance();
    private fomatadorData = new FormatadorDate();
    private serviceUsuario = new UsuarioService();
    private serviceEstoque = new EstoqueService();

    cadastrarEmprestimo(emprestimoData: any): Emprestimo {
        const { usuarioId, estoqueId } = emprestimoData;
        let { dataEmprestimo, dataDevolucao, dataEntrega, dataAtraso, suspensasaoAte } = emprestimoData;

        if (!usuarioId || !estoqueId) {
            throw new Error("Campos obrigatórios não preenchidos");
        }

        const validadorUsuarioExistente = this.serviceUsuario.listarUsuarios(usuarioId);
        if (!validadorUsuarioExistente) {
            throw new Error("Usuário nao encontrado na base de dados");
        }

        const validadorEstoqueExistente = this.serviceEstoque.listarPorFiltro(estoqueId);
        if (validadorEstoqueExistente) {
            if (validadorEstoqueExistente[0].disponivel === false) {
                throw new Error("Livro indisponivel");
            } else {
                dataEmprestimo = Date.now();
                dataEmprestimo = this.fomatadorData.formatarData(dataEmprestimo);
                dataDevolucao = this.cadastrarDevolucao(validadorUsuarioExistente[0].categoriaUsuario.nome,
                    validadorUsuarioExistente[0].curso.nome,
                    validadorEstoqueExistente[0].livroId.categoriaLivro.nome, dataEmprestimo);
                validadorEstoqueExistente[0].quantidade_emprestada = validadorEstoqueExistente[0].quantidade_emprestada + 1;
                this.serviceEstoque.atualizarDisponibilidade(estoqueId, validadorEstoqueExistente[0]);
            }
        } else {
            throw new Error("Estoque nao encontrado na base de dados");
        }

        const emprestimo = new Emprestimo(validadorUsuarioExistente[0], validadorEstoqueExistente[0], dataEmprestimo, dataDevolucao, dataEntrega, dataAtraso, suspensasaoAte);
        this.repository.cadastrar(emprestimo);
        return emprestimo;
    }

    cadastrarDevolucao(categoriaUsuarioNome: string, cursoNome: string, livroCategoria: string, dataEmprestimo: Date): Date {
        if (categoriaUsuarioNome === "Professor") {
            return this.fomatadorData.adicionarDias(dataEmprestimo, 40);
        } else if (categoriaUsuarioNome === "Aluno") {
            if (cursoNome === "ADS" && livroCategoria === "Computação") {
                return this.fomatadorData.adicionarDias(dataEmprestimo, 30);
            } else if (cursoNome === "Pedagogia" && livroCategoria === "Letras") {
                return this.fomatadorData.adicionarDias(dataEmprestimo, 30);

            } else if (cursoNome === "Administração" && livroCategoria === "Gestão") {
                return this.fomatadorData.adicionarDias(dataEmprestimo, 30);
            } else {
                return this.fomatadorData.adicionarDias(dataEmprestimo, 15);
            }
        } else {
            throw new Error("Usuario nao pode pegar livro emprestado");
        }
    }

    listarTodosEmprestimos(): Emprestimo[] {
        return this.repository.listar();
    }
}