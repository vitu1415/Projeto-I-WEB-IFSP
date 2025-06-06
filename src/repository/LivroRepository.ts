import { Livro } from "../model/Livro";

export class LivroRepository {
    private static instance: LivroRepository;
    private livros: Livro[] = [];

    private constructor(){}

    public static getInstance(): LivroRepository {
        if (!this.instance) {
            this.instance = new LivroRepository();
        }
        return this.instance;
    }

    listar(): Livro[] {
        return this.livros;
    }

    cadastrar(usuario: Livro): void {
        this.livros.push(usuario);
    }

    filtrarPorCampos(livro: any): Livro[] {
        const { id, titulo, autor, editora, edicao, isbn, categoriaLivro } = livro;

        let resultado = this.listar();
        if (id !== undefined) {
            resultado = resultado.filter(u => u.id === Number(id));
        }
        if (titulo !== undefined) {
            resultado = resultado.filter(u => u.titulo === titulo);
        }
        if (autor !== undefined) {
            resultado = resultado.filter(u => u.autor === autor);
        }
        if (editora !== undefined) {
            resultado = resultado.filter(u => u.editora === editora);
        }
        if (edicao !== undefined) {
            resultado = resultado.filter(u => u.edicao === edicao);
        }
        if (isbn !== undefined) {
            resultado = resultado.filter(u => u.isbn === isbn);
        }

        return resultado;
    }

    findByISBN(isbn: string): Livro[] {
        const livro = this.filtrarPorCampos(isbn);
        console.log(livro);
        if (!livro) {
            throw new Error("Livro nao encontrado na base de dados");
        }
        return livro;
    }

    atualizar(isbnFiltro: any, livro: any): Livro[] {
        let resultado = this.filtrarPorCampos(isbnFiltro);
        if(!resultado){
            throw new Error("Livro nao encontrado");
        }
        const { titulo, autor, editora, edicao, isbn, categoriaLivro } = livro;
        if (titulo !== undefined) {
            resultado[0].titulo = titulo;
        }
        if (autor !== undefined) {
            resultado[0].autor = autor;
        }
        if (editora !== undefined) {
            resultado[0].editora = editora;
        }
        if (edicao !== undefined) {
            resultado[0].edicao = edicao;
        }
        if (isbn !== undefined) {
            resultado[0].isbn = isbn;
        }
        if (categoriaLivro !== undefined) {
            resultado[0].categoriaLivro = categoriaLivro;
        }

        return resultado;
    }

    remover(isbn: any): void {
        const index = this.livros.findIndex(u => u.isbn === isbn);
        if (index !== -1) {
            this.livros.splice(index, 1);
        } else {
            throw new Error("Livro nao encontrado");
        }
    }
}