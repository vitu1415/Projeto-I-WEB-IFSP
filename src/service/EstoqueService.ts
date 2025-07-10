import { Estoque } from "../model/Estoque/Entity/EstoqueEntity";
import { EstoqueResponseDTO } from "../model/Estoque/dto/EstoqueResponseDTO";
import { EstoqueRequestDTO } from "../model/Estoque/dto/EstoqueRequestDTO";
import { Livro } from "../model/Livro/Entity/LivroEntity";
import { LivroResponseDTO } from "../model/Livro/dto/LivroResponseDTO";
import { EstoqueRepository } from "../repository/EstoqueRepository";
import { EmprestimoService } from "./EmprestimoService";
import { LivroService } from "./LivroService";

interface LivroDTO {
    id: number;
    titulo: string;
    autor: string;
    editora: string;
    edicao: string;
    isbn: string;
    categoriaLivro: {
        id: number;
        nome: string;
    };
}

export class EstoqueService {
    private repository = EstoqueRepository.getInstance()
    private serviceLivro = new LivroService();


    async cadastrarEstoque(estoqueData: any): Promise<EstoqueResponseDTO[]> {
        const { quantidade, quantidade_emprestada, disponivel, livroId } = estoqueData;

        if (!livroId) {
            throw new Error("Id do livro nao foi passado");
        }

        const estoque = new Estoque(livroId, quantidade, quantidade_emprestada, disponivel);
        const resultado: any = await this.repository.cadastrar(estoque);
        return await this.listarPorFiltro({id: resultado.insertId});
    }

    async buscarListaLivro(livroId: any): Promise<LivroDTO> {
        let listaLivro = await this.serviceLivro.listarLivros({ id: livroId });
        if (!listaLivro || listaLivro.length === 0) {
            throw new Error("Livro nao encontrado na base de dados");
        }

        const livroRefatorado = listaLivro.map(livro => ({
            id: livro.id,
            titulo: livro.titulo,
            autor: livro.autor,
            editora: livro.editora,
            edicao: livro.edicao,
            isbn: livro.isbn,
            categoriaLivro: {
                id: livro.categoriaLivro.id,
                nome: livro.categoriaLivro.nome
            }
        }))

        return livroRefatorado[0];
    }

    async listarEstoqueDisponivel(): Promise<any[]> {
        const estoque = await this.repository.filtrarPorCampos({ disponivel: true });

        const estoqueCompleto = await Promise.all(
            estoque.map(async (e) => {
                const livro = await this.serviceLivro.listarLivros({ id: e.livroId });
                
                return {
                    id: e.id,
                    livroId: {
                        ...livro[0],
                    },
                    quantidade: e.quantidade,
                    quantidade_emprestada: e.quantidade_emprestada,
                    disponivel: e.disponivel
                };
            }
        ));

        return estoqueCompleto;
    }

    async listarPorFiltro(estoque: any): Promise<any[]> {
        const estoqueFiltrado = await this.repository.filtrarPorCampos(estoque);

        if (estoqueFiltrado.length === 0) {
            throw new Error("Estoque nao encontrado na base de dados");
        }
        const estoqueCompleto = await Promise.all(
            estoqueFiltrado.map(async (e) => {
                const livro = await this.serviceLivro.listarLivros({ id: e.livroId });
                
                return {
                    id: e.id,
                    livroId: {
                        ...livro[0],
                    },
                    quantidade: e.quantidade,
                    quantidade_emprestada: e.quantidade_emprestada,
                    disponivel: e.disponivel
                };
            })
        );

        return estoqueCompleto;
    }

    async buscarExplarEmEstoque(id: any): Promise<LivroResponseDTO[]> {
        let livro: Livro[];
        const resultado = await this.repository.findById(id);
        if (resultado) {
            livro = await this.serviceLivro.listarLivros({ id: resultado.livroId });
            if (!livro) {
                throw new Error("Livro nao encontrado na base de dados");
            }
            return livro;
        } else {
            throw new Error("Codigo nao existe na base de dados");
        }
    }

    async atualizarDisponibilidade(id: any, estoqueData: Estoque): Promise<Estoque[]> {
        const { quantidade, quantidade_emprestada } = estoqueData;
        let resultado: Estoque[] = await this.repository.filtrarPorCampos({id: id});
        if (resultado) {
            if (quantidade > quantidade_emprestada) {
                resultado[0].quantidade = quantidade;
                resultado[0].quantidade_emprestada = quantidade_emprestada + 1;
                if (resultado[0].quantidade === resultado[0].quantidade_emprestada) {
                    resultado[0].disponivel = false;
                }
                resultado = await this.repository.atualizar(id, resultado[0]);
            } else {
                throw new Error("Quantidade emprestada nao pode ser maior que a quantidade total, livro indisponivel");
            }
        } else {
            throw new Error("Nao existe esse codigo no estoque na base de dados");
        }
        return resultado;
    }

    async atualizarDisponibilidadeManualmente(id: any, estoqueData: Partial<EstoqueRequestDTO>): Promise<Estoque[]> {
        if (!estoqueData.disponivel) {
            throw new Error("Disponibilidade deve ser informada");
        }
        let resultado: Estoque[] = await this.repository.filtrarPorCampos({id: id});
        if (resultado !== undefined && resultado.length > 0) {
            resultado = await this.repository.atualizar(id, resultado[0]);
        } else{
            throw new Error("Nao existe esse codigo no estoque na base de dados");
        }

        return resultado;
    }    
    async devolucaoAtualizarDisponibilidade(id: any, estoqueData: Estoque): Promise<Estoque[]> {
        const { quantidade, quantidade_emprestada } = estoqueData;
        let resultado: Estoque[] = await this.repository.filtrarPorCampos(id);
        if (resultado) {
            resultado[0].quantidade = quantidade;
            resultado[0].quantidade_emprestada = quantidade_emprestada - 1;
            resultado[0].disponivel = true;
            resultado = await this.repository.atualizar(id, resultado[0]);
        } else {
            throw new Error("Nao existe esse codigo no estoque na base de dados");
        }
        return resultado;
    }

    async deletarEstoque(id: any): Promise<void> {
        const serviceEmprestimo = new EmprestimoService();
        const resultado = await serviceEmprestimo.listarEmprestimoPorEstoque(id);
        let resultado_final = resultado.find(e => e.estoqueId.quantidade_emprestada != 0);
        if (resultado_final !== undefined) {
            throw new Error("Estoque possui emprestimos em aberto, nao e possivel remover");
        }
        return this.repository.remover(id);
    }
}