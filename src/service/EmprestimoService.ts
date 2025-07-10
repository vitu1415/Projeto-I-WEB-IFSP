import { CategoriaStatus } from "../model/enum/CategoriaStatusEnum";
import { Emprestimo } from "../model/Emprestimo/Entity/EmprestimoEntity";
import { EmprestimoResponseDTO } from "../model/Emprestimo/dto/EmprestimoResponseDTO";
import { EmprestimoRepository } from "../repository/EmprestimoRepository";
import { EstoqueService } from "./EstoqueService";
import { FormatadorDate } from "../Utils/FormatadorDate";
import { UsuarioService } from "./UsuarioService";

export class EmprestimoService {
    private repository = EmprestimoRepository.getInstance();
    private fomatadorData = new FormatadorDate();
    private serviceUsuario = new UsuarioService();
    private serviceEstoque = new EstoqueService();

    async cadastrarEmprestimo(emprestimoData: any): Promise<EmprestimoResponseDTO[]> {
        const { usuarioId, estoqueId } = emprestimoData;
        let { dataEmprestimo, dataDevolucao, dataEntrega, diasAtraso, suspensasaoAte } = emprestimoData;

        if (!usuarioId || !estoqueId) {
            throw new Error("Campos obrigatórios não preenchidos");
        }

        const validadorUsuarioExistente = await this.serviceUsuario.listarUsuarios({id: usuarioId});
        if (validadorUsuarioExistente) {
            if (validadorUsuarioExistente[0].ativo === CategoriaStatus.INATIVO) {
                throw new Error("Usuario inativo, nao pode pegar livro emprestado");
            } else if (validadorUsuarioExistente[0].ativo === CategoriaStatus.SUSPENSO) {
                throw new Error("Usuario suspenso, nao pode pegar livro emprestado");
            }
        } else {
            throw new Error("Usuário nao encontrado na base de dados");
        }

        const validadorEstoqueExistente = await this.serviceEstoque.listarPorFiltro({ id: estoqueId });
        if (validadorEstoqueExistente) {
            if (validadorEstoqueExistente[0].disponivel === false) {
                throw new Error("Livro indisponivel");
            } else {
                dataEmprestimo = new Date();
                dataEntrega = await this.cadastrarEntrega(validadorUsuarioExistente[0].categoriaUsuario.nome,
                    validadorUsuarioExistente[0].curso.nome,
                    validadorEstoqueExistente[0].livroId.categoriaLivro.nome, dataEmprestimo, validadorUsuarioExistente[0].id);
                await this.serviceEstoque.atualizarDisponibilidade(estoqueId, validadorEstoqueExistente[0]);
            }
        } else {
            throw new Error("Estoque nao encontrado na base de dados");
        }
        dataDevolucao = null;
        diasAtraso = 0;
        suspensasaoAte = null;
        const emprestimo = new Emprestimo(validadorUsuarioExistente[0], validadorEstoqueExistente[0], dataEmprestimo, dataDevolucao, dataEntrega, diasAtraso, suspensasaoAte);
        const resultado: any = await this.repository.cadastrar(emprestimo);
        return await this.listarEmprestimosPorFiltro({id: resultado.insertId});
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

    async cadastrarEntrega(categoriaUsuarioNome: string, cursoNome: string, livroCategoria: string, dataEmprestimo: Date, id: number): Promise<Date> {
        let quantidadeDeEmprestimo: Emprestimo[] = await this.repository.buscarPorUsuario(id);
        quantidadeDeEmprestimo = quantidadeDeEmprestimo.filter(e => e.dataDevolucao === null);
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

    async listarEmprestimosCompletos(emprestimos: Emprestimo[]): Promise<any[]> {
        const emprestimosCompletos = await Promise.all(
            emprestimos.map(async (e) => {
                const usuario = await this.serviceUsuario.listarUsuarios({ id: e.usuarioId });
                const estoque = await this.serviceEstoque.listarPorFiltro({ id: e.estoqueId });
                return {
                    id: e.id,
                    usuario: {
                        id: usuario[0].id,
                        nome: usuario[0].nome,
                        cpf: usuario[0].cpf,
                        ativo: usuario[0].ativo,
                        categoriaUsuario: {
                            id: usuario[0].categoriaUsuario.id,
                            nome: usuario[0].categoriaUsuario.nome
                        },
                        curso: {
                            id: usuario[0].curso.id,
                            nome: usuario[0].curso.nome
                        }
                    },
                    estoque: {
                        id: estoque[0].id,
                        livroId: {
                            id: estoque[0].livroId.id,
                            titulo: estoque[0].livroId.titulo,
                            autor: estoque[0].livroId.autor,
                            editora: estoque[0].livroId.editora,
                            edicao: estoque[0].livroId.edicao,
                            isbn: estoque[0].livroId.isbn,
                            categoriaLivro: {
                                id: estoque[0].livroId.categoriaLivro.id,
                                nome: estoque[0].livroId.categoriaLivro.nome
                            }
                        },
                        quantidade: estoque[0].quantidade,
                        quantidade_emprestada: estoque[0].quantidade_emprestada,
                        disponivel: estoque[0].disponivel
                    },
                    dataEmprestimo: e.dataEmprestimo,
                    dataDevolucao: e.dataDevolucao,
                    dataEntrega: e.dataEntrega,
                    diasAtraso: e.diasAtraso,
                    suspensaoAte: e.suspensaoAte
                };
            })
        );
        return emprestimosCompletos;
    }

    async listarTodosEmprestimos(): Promise<EmprestimoResponseDTO[]> {
        const resultado = await this.repository.listar();
        const emprestimosCompletos = await this.listarEmprestimosCompletos(resultado);
        return emprestimosCompletos;
    }

    async listarEmprestimosPorFiltro(filtro: any): Promise<EmprestimoResponseDTO[]> {
        const resultado: Emprestimo[] = await this.repository.filtrarPorCamposEstoque(filtro);
        if (resultado.length === 0) {
            throw new Error("Nenhum emprestimo encontrado com os filtros fornecidos");
        }
        const emprestimosCompletos = await this.listarEmprestimosCompletos(resultado);
        return emprestimosCompletos;
    }

    async listarEmprestimosPorUsuario(usuarioCPF: string): Promise<Emprestimo[]> {
        const resultado: Emprestimo[] = await this.repository.filtrarPorUsuarioId(usuarioCPF);
        if (resultado.length === 0) {
            throw new Error("Nenhum emprestimo encontrado para o usuario com id: " + usuarioCPF);
        }
        return resultado;
    }

    async vaidarDataDeEntregaEAtrasos(id: number, resultado: any, diasDeEntrega: number, categoriaUsuario: string, cursoNome: string, categoriaLivro: string): Promise<any> {
        let diasDeAtraso: number = 0;
        const prazo = this.calcularPrazo(cursoNome, categoriaLivro, categoriaUsuario);
        if (prazo === 40 && categoriaUsuario === "Professor") {
            if (diasDeEntrega > 40) {
                diasDeAtraso = diasDeEntrega - 40;
                resultado = await this.repository.cadastrarAtraso(id, diasDeAtraso);
            } else {
                resultado = await this.repository.cadastrarAtraso(id, diasDeAtraso);
            }
        } else if (categoriaUsuario === "Aluno") {
            if (prazo === 30 && (cursoNome === "ADS" &&
                categoriaLivro === "Computação" ||
                cursoNome === "Pedagogia" && categoriaLivro === "Letras" ||
                cursoNome === "Administração" && categoriaLivro === "Gestão")) {
                if (diasDeEntrega > 30) {
                    diasDeAtraso = diasDeEntrega - 30;
                    await this.repository.cadastrarAtraso(id, diasDeAtraso);
                } else {
                    await this.repository.cadastrarAtraso(id, diasDeAtraso);
                }
            } else {
                if (diasDeEntrega > 15) {
                    diasDeAtraso = diasDeEntrega - 15;
                    await this.repository.cadastrarAtraso(id, diasDeAtraso);
                } else {
                    await this.repository.cadastrarAtraso(id, diasDeAtraso);
                }
            }
        }
    }

    async devolucaoEmprestimo(id: any): Promise<Emprestimo> {
        let resultado: any = await this.repository.devolucaoEmprestimo(id);
        resultado = await this.listarEmprestimosPorFiltro({ id: resultado.id });
        await this.serviceEstoque.devolucaoAtualizarDisponibilidade(resultado[0].estoque.id, resultado[0].estoque);
        const diasDaEntrega = await this.fomatadorData.diferencaEmDias(resultado[0].dataEntrega, resultado[0].dataDevolucao);
        await this.vaidarDataDeEntregaEAtrasos(id, resultado[0], diasDaEntrega,
            resultado[0].usuario.categoriaUsuario.nome, resultado[0].usuario.curso.nome,
            resultado[0].estoque.livroId.categoriaLivro.nome);
        resultado = await this.repository.devolucaoEmprestimo(id);
        return resultado;
    }

    async verificadorDeAtraso() {
        const emprestimos = await this.repository.listarEmprestimosAtrasados();
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


    async listarEmprestimoPorUsuario(id: number): Promise<Emprestimo[]> {
        const resultado: Emprestimo[] = await this.repository.buscarPorUsuario(id);
        return resultado;
    }

    async listarEmprestimoPorLivro(isbn: string): Promise<Emprestimo[]> {
        const resultado: Emprestimo[] = await this.repository.buscarPorLivro(isbn);
        return resultado;
    }

    async listarEmprestimoPorEstoque(estoqueId: any): Promise<Emprestimo[]> {
        const resultado: Emprestimo[] = await this.repository.BuscarPorEstoque(estoqueId);
        return resultado;
    }
}