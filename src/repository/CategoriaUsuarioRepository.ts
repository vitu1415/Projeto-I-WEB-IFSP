import { CategoriaLivro } from "../model/CategoriaLivro";

export class CategoriaUsuarioRepository {
    private static instance: CategoriaUsuarioRepository
    private categoriasUsuario: CategoriaLivro[] = [];

    private constructor(){
        this.categoriasUsuario.push(new CategoriaLivro(1, "Aluno"))
        this.categoriasUsuario.push(new CategoriaLivro(2, "Professor"))
        this.categoriasUsuario.push(new CategoriaLivro(3, "Funcionario"))
    }

    public static getInstance(): CategoriaUsuarioRepository {
        if (!this.instance) {
            this.instance = new CategoriaUsuarioRepository();
        }
        return this.instance;
    }

    public listar(): CategoriaLivro[] {
        return this.categoriasUsuario;
    }
}