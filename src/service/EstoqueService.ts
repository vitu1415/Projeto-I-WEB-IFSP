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


    cadastrarEstoque(estoqueData: any): Estoque {
        const { quantidade, quantidade_emprestada, disponivel } = estoqueData;
        let { livroId } = estoqueData;

        if (!livroId) {
            throw new Error("Id do livro nao foi passado");
        }

        livroId = this.buscarListaLivro(livroId);

        const estoque = new Estoque(livroId, quantidade, quantidade_emprestada, disponivel);
        this.repository.cadastrar(estoque);
        return estoque;
    }

    buscarListaLivro(livroId: any): LivroDTO {
        let listaLivro = this.serviceLivro.listarLivros({ id: livroId });
        console.log(listaLivro);
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

    listarEstoqueDisponivel(): Estoque[] {
        return this.repository.filtrarPorCampos({ disponivel: true });
    }

    listarPorFiltro(estoque: any): Estoque[] {
        return this.repository.filtrarPorCampos(estoque);
    }

    buscarExplarEmEstoque(id: any): Livro[] {
        let livro: Livro[];
        const resultado = this.repository.findById(id);
        if (resultado) {
            livro = this.serviceLivro.listarLivros({ id: resultado.livroId.id });
            if (!livro) {
                throw new Error("Livro nao encontrado na base de dados");
            }
            return livro;
        } else {
            throw new Error("Codigo nao existe na base de dados");
        }
    }

    atualizarDisponibilidade(id: any, estoqueData: Estoque): Estoque[] {
        const { quantidade, quantidade_emprestada } = estoqueData;
        let resultado: Estoque[] = this.repository.filtrarPorCampos(id);
        if (resultado) {
            if (quantidade > quantidade_emprestada) {
                resultado[0].quantidade = quantidade;
                resultado[0].quantidade_emprestada = quantidade_emprestada + 1;
                if (resultado[0].quantidade === resultado[0].quantidade_emprestada) {
                    resultado[0].disponivel = false;
                }
                resultado = this.repository.atualizar(id, resultado[0]);
            } else {
                throw new Error("Quantidade emprestada nao pode ser maior que a quantidade total, livro indisponivel");
            }
        } else {
            throw new Error("Nao existe esse codigo no estoque na base de dados");
        }
        return resultado;
    }

    devolucaoAtualizarDisponibilidade(id: any, estoqueData: Estoque): Estoque[] {
        const { quantidade, quantidade_emprestada } = estoqueData;
        let resultado: Estoque[] = this.repository.filtrarPorCampos(id);
        if (resultado) {
            resultado[0].quantidade = quantidade;
            resultado[0].quantidade_emprestada = quantidade_emprestada - 1;
            resultado[0].disponivel = true;
            resultado = this.repository.atualizar(id, resultado[0]);
        } else {
            throw new Error("Nao existe esse codigo no estoque na base de dados");
        }
        return resultado;
    }

    deletarEstoque(id: any): void {
        const serviceEmprestimo = new EmmprestimoService();
        const resultado = serviceEmprestimo.listarEmprestimoPorEstoque(id);
        let resultado_final = resultado.find(e => e.estoqueId.quantidade_emprestada != 0);
        if (resultado_final !== undefined) {
            throw new Error("Estoque possui emprestimos em aberto, nao e possivel remover");
        }
        return this.repository.remover(id);
    }
}