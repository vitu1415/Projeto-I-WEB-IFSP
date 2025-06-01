import { CategoriaLivro } from "../model/CategoriaLivro";

export class CategoriaLivroRepository {
    private static instance: CategoriaLivroRepository;
    private categoriasLivro: CategoriaLivro[] = [];

    private constructor(){
        this.categoriasLivro.push(new CategoriaLivro(1, "Romance"))
        this.categoriasLivro.push(new CategoriaLivro(2, "Computação"))
        this.categoriasLivro.push(new CategoriaLivro(3, "Letras"))
        this.categoriasLivro.push(new CategoriaLivro(4, "Gestão"))
    }

    public static getInstance(): CategoriaLivroRepository {
        if (!this.instance) {
            this.instance = new CategoriaLivroRepository();
        }
        return this.instance;
    }

    public listar(): CategoriaLivro[] {
        return this.categoriasLivro;
    }
}