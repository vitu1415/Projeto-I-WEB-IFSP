import { CategoriaLivro } from "../model/CategoriaLivro";
import { Emprestimo } from "../model/Emprestimo";
import { Estoque } from "../model/Estoque";
import { Livro } from "../model/Livro";
import { EstoqueRepository } from "../repository/EstoqueRepository";
import { EmmprestimoService } from "./EmprestimoService";
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


    async cadastrarEstoque(estoqueData: any): Promise<Estoque> {
        const { quantidade, quantidade_emprestada, disponivel } = estoqueData;
        let { livroId } = estoqueData;

        if (!livroId) {
            throw new Error("Id do livro nao foi passado");
        }

        livroId = await this.buscarListaLivro(livroId);

        const estoque = new Estoque(livroId, quantidade, quantidade_emprestada, disponivel);
        await this.repository.cadastrar(estoque);
        return estoque;
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

    listarEstoqueDisponivel(): Promise<Estoque[]> {
        return this.repository.filtrarPorCampos({ disponivel: true });
    }

    listarPorFiltro(estoque: any): Promise<Estoque[]> {
        return this.repository.filtrarPorCampos(estoque);
    }

    async buscarExplarEmEstoque(id: any): Promise<Livro[]> {
        let livro: Livro[];
        const resultado = await this.repository.findById(id);
        if (resultado) {
            livro = await this.serviceLivro.listarLivros({ id: resultado.livroId.id });
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
        let resultado: Estoque[] = await this.repository.filtrarPorCampos(id);
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
        const serviceEmprestimo = new EmmprestimoService();
        const resultado = await serviceEmprestimo.listarEmprestimoPorEstoque(id);
        let resultado_final = resultado.find(e => e.estoqueId.quantidade_emprestada != 0);
        if (resultado_final !== undefined) {
            throw new Error("Estoque possui emprestimos em aberto, nao e possivel remover");
        }
        return this.repository.remover(id);
    }
}