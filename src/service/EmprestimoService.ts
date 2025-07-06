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

    async cadastrarEmprestimo(emprestimoData: any): Promise<Emprestimo> {
        const { usuarioId, estoqueId } = emprestimoData;
        let { dataEmprestimo, dataDevolucao, dataEntrega, diasAtraso, suspensasaoAte } = emprestimoData;

        if (!usuarioId || !estoqueId) {
            throw new Error("Campos obrigatórios não preenchidos");
        }

        const validadorUsuarioExistente = await this.serviceUsuario.listarUsuarios(usuarioId);
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

    calcularPrazo(curso: string, categoriaLivro: string, categoriaUsuario: string): number {
        if (categoriaUsuario === "Professor") {
            return 40;
        } else {
            if (curso === "ADS" && categoriaLivro === "Computação") {
                return 30;
            } else if (curso === "Pedagogia" && categoriaLivro === "Letras") {
                return 30;
            } else if (curso === "Administração" && categoriaLivro === "Gestão") {
                return 30;
            } else {
                return 15;
            }
        }
    }

    cadastrarEntrega(categoriaUsuarioNome: string, cursoNome: string, livroCategoria: string, dataEmprestimo: Date, id: number): Date {
        let quantidadeDeEmprestimo: Emprestimo[] = this.repository.buscarPorUsuario(id);
        if (categoriaUsuarioNome === "Professor") {
            if (quantidadeDeEmprestimo.length < 5) {
                return this.fomatadorData.adicionarDias(dataEmprestimo, this.calcularPrazo(cursoNome, livroCategoria, categoriaUsuarioNome));
            } else {
                throw new Error("Professor nao pode pegar mais de 5 livros emprestados");
            }
        } else if (categoriaUsuarioNome === "Aluno") {
            if (quantidadeDeEmprestimo.length < 3) {
                return this.fomatadorData.adicionarDias(dataEmprestimo, this.calcularPrazo(cursoNome, livroCategoria, categoriaUsuarioNome));
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

    vaidarDataDeEntregaEAtrasos(id: number, resultado: any, diasDeEntrega: number, categoriaUsuario: string, cursoNome: string, categoriaLivro: string): void {
        let diasDeAtraso: number = 0;
        const prazo = this.calcularPrazo(cursoNome, categoriaLivro, categoriaUsuario);
        if (prazo === 40 && categoriaUsuario === "Professor") {
            if (diasDeEntrega > 40) {
                diasDeAtraso = diasDeEntrega - 40;
                resultado = this.repository.cadastrarAtraso(id, diasDeAtraso);
            } else {
                resultado = this.repository.cadastrarAtraso(id, diasDeAtraso);
            }
        } else if (categoriaUsuario === "Aluno") {
            if (prazo === 30 && (cursoNome === "ADS" &&
                categoriaLivro === "Computação" ||
                cursoNome === "Pedagogia" && categoriaLivro === "Letras" ||
                cursoNome === "Administração" && categoriaLivro === "Gestão")) {
                if (diasDeEntrega > 30) {
                    diasDeAtraso = diasDeEntrega - 30;
                    this.repository.cadastrarAtraso(id, diasDeAtraso);
                } else {
                    this.repository.cadastrarAtraso(id, diasDeAtraso);
                }
            } else {
                if (diasDeEntrega > 15) {
                    diasDeAtraso = diasDeEntrega - 15;
                    this.repository.cadastrarAtraso(id, diasDeAtraso);
                } else {
                    this.repository.cadastrarAtraso(id, diasDeAtraso);
                }
            }
        }
    }

    devolucaoEmprestimo(id: any): any {
        let resultado = this.repository.devolucaoEmprestimo(id);
        this.serviceEstoque.devolucaoAtualizarDisponibilidade(resultado.estoqueId.id, resultado.estoqueId);
        const diasDaEntrega = this.fomatadorData.diferencaEmDias(resultado.dataEntrega, resultado.dataDevolucao);
        this.vaidarDataDeEntregaEAtrasos(id, resultado, diasDaEntrega,
            resultado.usuarioId.categoriaUsuario.nome, resultado.usuarioId.curso.nome,
            resultado.estoqueId.livroId.categoriaLivro.nome);
        resultado = this.repository.devolucaoEmprestimo(id);
        return resultado;
    }

    async verificadorDeAtraso() {
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
            const usuario = await this.serviceUsuario.buscarUsuario(cpf);

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