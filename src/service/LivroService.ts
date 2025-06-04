import { Livro } from "../model/Livro";
import { LivroRepository } from "../repository/LivroRepository";

export class LivroService {
    private repository = LivroRepository.getInstance()

    criarCadastrarLivro(livroData: any): Livro {
        const { titulo, isbn, autor, edicao, editora, categoriaLivro } = livroData;
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

        const livro = new Livro(titulo, autor, editora, edicao, isbn, categoriaLivro);
        this.repository.cadastrar(livro);
        return livro;
    }

    listarLivors(livroData: any): Livro[] {
        return this.repository.filtrarPorCampos(livroData);
    }

    atualizarLivro(isbnFiltro: any, livro: any): Livro[] {
        return this.repository.atualizar(isbnFiltro, livro);
    }

    removerLivro(isbn: any): void {
        this.repository.remover(isbn);
    }
}