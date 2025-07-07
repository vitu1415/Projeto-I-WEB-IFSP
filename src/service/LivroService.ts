import { Livro } from "../model/Livro";
import { LivroRepository } from "../repository/LivroRepository";
import { CategoriaLivroService } from "./CategoriaLivroService";
import { EmmprestimoService } from "./EmprestimoService";

export class LivroService {
    private repository = LivroRepository.getInstance()
    private categoriaLivroService = new CategoriaLivroService();

    async criarCadastrarLivro(livroData: any): Promise<Livro> {
        const { titulo, isbn, autor, edicao, editora } = livroData;
        let { categoriaLivro } = livroData;
        if (!titulo || !isbn || !autor || !edicao || !editora || !categoriaLivro) {
            throw new Error("esta faltando dados que sao obrigatorios");
        }

        const livroExistente = await this.repository.filtrarPorCampos({isbn});
        if (livroExistente) {
            throw new Error("ISBN ja cadastrado");
        }

        const livroSequeciaExistente = await this.repository.filtrarPorCampos({ autor, editora, edicao });
        if (livroSequeciaExistente) {
            throw new Error("Essa sequencia de autor, editora, edicao ja foi cadastrada");
        }

        categoriaLivro = await this.categoriaLivroService.listarPorFiltro(categoriaLivro);
        if (!categoriaLivro) {
            throw new Error("Categoria livro nao encontrada");
        }

        const livro = new Livro(titulo, autor, editora, edicao, isbn, categoriaLivro[0].id);
        await this.repository.cadastrar(livro);
        return livro;
    }

    listarLivros(livroData: any): Promise<Livro[]> {
        if (livroData === undefined || Object.keys(livroData).length === 0) {
            return this.repository.listar();
        }
        return this.repository.filtrarPorCampos(livroData);
    }

    buscarLivroPorISBN(isbn: any): Promise<Livro> {
        return this.repository.findByISBN(isbn);
    }

    async atualizarLivro(isbnFiltro: any, livro: any): Promise<void> {
        let { categoriaLivro } = livro;
        if (categoriaLivro) {
            categoriaLivro = await this.categoriaLivroService.listarPorFiltro(categoriaLivro.id);
            if (!categoriaLivro) {
                throw new Error("Categoria livro nao encontrada");
            }
            livro.categoriaLivro = categoriaLivro;
        }
        return await this.repository.atualizar(isbnFiltro, livro);
    }

    removerLivro(isbn: any): void {
        const serviceEmprestimo = new EmmprestimoService();
        const resultado = serviceEmprestimo.listarEmprestimoPorLivro(isbn);
        let resultado_final = resultado.find(e => e.dataDevolucao === null);
        if (resultado_final !== undefined) {
            throw new Error("Livro possui emprestimos em aberto, nao e possivel remover");
        }
        this.repository.remover(isbn);
    }
}