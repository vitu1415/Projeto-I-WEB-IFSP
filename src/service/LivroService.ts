import { Livro } from "../model/Livro";
import { LivroRepository } from "../repository/LivroRepository";
import { CategoriaLivroService } from "./CategoriaLivroService";
import { EmmprestimoService } from "./EmprestimoService";

export class LivroService {
    private repository = LivroRepository.getInstance()
    private categoriaLivroService = new CategoriaLivroService();

    criarCadastrarLivro(livroData: any): Livro {
        const { titulo, isbn, autor, edicao, editora } = livroData;
        let { categoriaLivro } = livroData;
        if (!titulo || !isbn || !autor || !edicao || !editora || !categoriaLivro) {
            throw new Error("esta faltando dados que sao obrigatorios");
        }

        const livroExistente = this.repository.listar().find(u => u.isbn === isbn);
        if (livroExistente) {
            throw new Error("ISBN ja cadastrado");
        }

        const livroSequeciaExistente = this.repository.listar().some(
            l => l.autor === autor &&
                l.editora === editora &&
                l.edicao === edicao);

        if (livroSequeciaExistente) {
            throw new Error("Essa sequencia de autor, editora, edicao ja foi cadastrada");
        }

        categoriaLivro = this.categoriaLivroService.listarPorFiltro(categoriaLivro);
        if (!categoriaLivro) {
            throw new Error("Categoria livro nao encontrada");
        }

        const livro = new Livro(titulo, autor, editora, edicao, isbn, categoriaLivro);
        this.repository.cadastrar(livro);
        return livro;
    }

    listarLivros(livroData: any): Livro[] {
        return this.repository.filtrarPorCampos(livroData);
    }

    buscarLivroPorISBN(isbn: any): Livro[] {
        console.log(isbn);
        return this.repository.findByISBN(isbn);
    }

    atualizarLivro(isbnFiltro: any, livro: any): Livro[] {
        return this.repository.atualizar(isbnFiltro, livro);
    }

    removerLivro(isbn: any): void {
        const serviceEmprestimo = new EmmprestimoService();
        let resultado = serviceEmprestimo.listarEmprestimoPorUsuario(isbn);
        resultado.find(e => e.dataDevolucao === null);
        if (resultado.length > 0) {
            throw new Error("Livro possui emprestimos em aberto, nao e possivel remover");
        }
        this.repository.remover(isbn);
    }
}