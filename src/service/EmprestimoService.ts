import { CategoriaStatus } from "../model/CategoriaStatusEnum";
import { Emprestimo } from "../model/Emprestimo";
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
        let { dataEmprestimo, dataDevolucao, dataEntrega, diasAtraso, suspensasaoAte } = emprestimoData;

        if (!usuarioId || !estoqueId) {
            throw new Error("Campos obrigatórios não preenchidos");
        }

        const validadorUsuarioExistente = this.serviceUsuario.listarUsuarios(usuarioId);
        if (validadorUsuarioExistente) {
            if (validadorUsuarioExistente[0].ativo === CategoriaStatus.INATIVO) {
                throw new Error("Usuario inativo, nao pode pegar livro emprestado");
            } else if (validadorUsuarioExistente[0].ativo === CategoriaStatus.SUSPENSO) {
                throw new Error("Usuario suspenso, nao pode pegar livro emprestado");
            }
        } else {
            throw new Error("Usuário nao encontrado na base de dados");
        }

        const validadorEstoqueExistente = this.serviceEstoque.listarPorFiltro(estoqueId);
        if (validadorEstoqueExistente) {
            if (validadorEstoqueExistente[0].disponivel === false) {
                throw new Error("Livro indisponivel");
            } else {
                dataEmprestimo = new Date();
                dataEntrega = this.cadastrarEntrega(validadorUsuarioExistente[0].categoriaUsuario.nome,
                    validadorUsuarioExistente[0].curso.nome,
                    validadorEstoqueExistente[0].livroId.categoriaLivro.nome, dataEmprestimo, validadorUsuarioExistente[0].id);
                this.serviceEstoque.atualizarDisponibilidade(estoqueId, validadorEstoqueExistente[0]);
            }
        } else {
            throw new Error("Estoque nao encontrado na base de dados");
        }
        const emprestimo = new Emprestimo(validadorUsuarioExistente[0], validadorEstoqueExistente[0], dataEmprestimo, dataDevolucao, dataEntrega, diasAtraso, suspensasaoAte);
        this.repository.cadastrar(emprestimo);
        return emprestimo;
    }

    cadastrarEntrega(categoriaUsuarioNome: string, cursoNome: string, livroCategoria: string, dataEmprestimo: Date, id: number): Date {
        let quantidadeDeEmprestimo: Emprestimo[] = this.repository.buscarPorUsuario(id);
        if (categoriaUsuarioNome === "Professor") {
            if (quantidadeDeEmprestimo.length < 5) {
                return this.fomatadorData.adicionarDias(dataEmprestimo, 40);
            } else {
                throw new Error("Professor nao pode pegar mais de 5 livros emprestados");
            }
        } else if (categoriaUsuarioNome === "Aluno") {
            if (quantidadeDeEmprestimo.length < 3) {
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
                throw new Error("Aluno nao pode pegar mais de 3 livros emprestados");
            }
        } else {
            throw new Error("Esse usuario nao pode pegar livro emprestado");
        }
    }

    listarTodosEmprestimos(): Emprestimo[] {
        return this.repository.listar();
    }

    listarEmprestimosPorUsuario(usuarioCPF: string): Emprestimo[] {
        const resultado: Emprestimo[] = this.repository.filtrarPorUsuarioId(usuarioCPF);
        if (resultado.length === 0) {
            throw new Error("Nenhum emprestimo encontrado para o usuario com id: " + usuarioCPF);
        }
        return resultado;
    }

    devolucaoEmprestimo(id: any): void {
        let resultado = this.repository.devolucaoEmprestimo(id);
        this.serviceEstoque.devolucaoAtualizarDisponibilidade(resultado.estoqueId.id, resultado.estoqueId);
        const diasDaEntrega = this.fomatadorData.diferencaEmDias(resultado.dataEntrega, resultado.dataDevolucao);
        if (resultado.usuarioId.categoriaUsuario.nome === "Professor") {
            if (diasDaEntrega > 40) {
                const diasDeAtraso = diasDaEntrega - 40;
                resultado = this.repository.cadastrarAtraso(id, diasDeAtraso);
                resultado = this.repository.cadastrarSuspensao(id, this.fomatadorData.adicionarDias(resultado.dataEmprestimo, diasDeAtraso));
            } else {
                resultado = this.repository.cadastrarAtraso(id, 0);
            }
        } else if (resultado.usuarioId.categoriaUsuario.nome === "Aluno") {
            if (resultado.usuarioId.curso.nome === "ADS" && resultado.estoqueId.livroId.categoriaLivro.nome === "Computação") {
                if (diasDaEntrega > 30) {
                    const diasDeAtraso = diasDaEntrega - 30;
                    resultado = this.repository.cadastrarAtraso(id, diasDeAtraso);
                    resultado = this.repository.cadastrarSuspensao(id, this.fomatadorData.adicionarDias(resultado.dataEmprestimo, diasDeAtraso));
                } else {
                    resultado = this.repository.cadastrarAtraso(id, 0);
                }
            } else if (resultado.usuarioId.curso.nome === "Pedagogia" && resultado.estoqueId.livroId.categoriaLivro.nome === "Letras") {
                if (diasDaEntrega > 30) {
                    const diasDeAtraso = diasDaEntrega - 30;
                    resultado = this.repository.cadastrarAtraso(id, diasDeAtraso);
                    resultado = this.repository.cadastrarSuspensao(id, this.fomatadorData.adicionarDias(resultado.dataEmprestimo, diasDeAtraso));
                } else {
                    resultado = this.repository.cadastrarAtraso(id, 0);
                }
            } else if (resultado.usuarioId.curso.nome === "Administração" && resultado.estoqueId.livroId.categoriaLivro.nome === "Gestão") {
                if (diasDaEntrega > 30) {
                    const diasDeAtraso = diasDaEntrega - 30;
                    resultado = this.repository.cadastrarAtraso(id, diasDeAtraso);
                    resultado = this.repository.cadastrarSuspensao(id, this.fomatadorData.adicionarDias(resultado.dataEmprestimo, diasDeAtraso));
                } else {
                    resultado = this.repository.cadastrarAtraso(id, 0);
                }
            } else {
                if (diasDaEntrega > 15) {
                    const diasDeAtraso = diasDaEntrega - 15;
                    resultado = this.repository.cadastrarAtraso(id, diasDeAtraso);
                    resultado = this.repository.cadastrarSuspensao(id, this.fomatadorData.adicionarDias(resultado.dataEmprestimo, diasDeAtraso));
                } else {
                    resultado = this.repository.cadastrarAtraso(id, 0);
                }
            }
        }
    }

    verificadorDeAtraso() {
        const emprestimos = this.repository.listar();
        const hoje = new Date();

        const atrasosGravesPorUsuario: Record<string, number> = {};

        emprestimos.forEach(emprestimo => {
            const { dataEntrega, dataDevolucao, usuarioId, id } = emprestimo;

            if (dataDevolucao === null && dataEntrega !== null) {
                const diasDeAtraso = this.fomatadorData.diferencaEmDias(hoje, new Date(dataEntrega));

                if (diasDeAtraso > 0) {
                    this.repository.cadastrarAtraso(id, diasDeAtraso);
                    this.repository.cadastrarSuspensao(id, this.fomatadorData.calcularSuspensaoAte(hoje, diasDeAtraso));

                    if (diasDeAtraso > 20) {
                        const cpf = usuarioId.cpf;
                        atrasosGravesPorUsuario[cpf] = (atrasosGravesPorUsuario[cpf] || 0) + 1;
                    }
                }
            }
        });

        for (const cpf in atrasosGravesPorUsuario) {
            const qtdAtrasos = atrasosGravesPorUsuario[cpf];
            const usuario = this.serviceUsuario.buscarUsuario(cpf);

            if (qtdAtrasos >= 2) {
                usuario.ativo = CategoriaStatus.INATIVO;
            } else if (qtdAtrasos === 1 && usuario.ativo === CategoriaStatus.ATIVO) {
                usuario.ativo = CategoriaStatus.SUSPENSO;
            }

            this.serviceUsuario.atualizarUsuario(cpf, usuario);
        }
    }


    listarEmprestimoPorUsuario(cpf: string): Emprestimo[] {
        const resultado: Emprestimo[] = this.repository.buscarPorUsuario(cpf);
        return resultado;
    }

    listarEmprestimoPorLivro(isbn: string): Emprestimo[] {
        const resultado: Emprestimo[] = this.repository.buscarPorLivro(isbn);
        return resultado;
    }

    listarEmprestimoPorEstoque(estoqueId: any): Emprestimo[] {
        const resultado: Emprestimo[] = this.repository.BuscarPorEstoque(estoqueId);
        return resultado;
    }
}