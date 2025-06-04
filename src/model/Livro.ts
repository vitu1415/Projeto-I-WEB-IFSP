import { CategoriaLivro } from "./CategoriaLivro";

export class Livro{
    id: number;
    titulo: string;
    autor: string;
    editora: string;
    edicao: string;
    isbn: string;
    categoriaLivro: CategoriaLivro;

    constructor( titulo: string, autor: string, editora: string, edicao: string,
        isbn: string, categoriaLivro: CategoriaLivro){
        this.id = this.gerarId();
        this.titulo = titulo;
        this.autor = autor;
        this.editora = editora;
        this.edicao = edicao;
        this.isbn = isbn;
        this.categoriaLivro = categoriaLivro;
    }
    private gerarId(): number {
        return Date.now();
    }
}