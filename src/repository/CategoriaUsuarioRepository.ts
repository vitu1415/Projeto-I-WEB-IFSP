import { CategoriaUsuario } from "../model/CategoriaUsuario";

export class CategoriaUsuarioRepository {
    private static instance: CategoriaUsuarioRepository
    private categoriasUsuario: CategoriaUsuario[] = [];

    private constructor(){
        this.categoriasUsuario.push(new CategoriaUsuario(1, "Aluno"))
        this.categoriasUsuario.push(new CategoriaUsuario(2, "Professor"))
        this.categoriasUsuario.push(new CategoriaUsuario(3, "Funcionario"))
    }

    public static getInstance(): CategoriaUsuarioRepository {
        if (!this.instance) {
            this.instance = new CategoriaUsuarioRepository();
        }
        return this.instance;
    }

    listar(): CategoriaUsuario[] {
        return this.categoriasUsuario;
    }
}