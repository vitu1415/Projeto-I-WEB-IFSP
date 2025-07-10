import { CategoriaStatus } from "../enum/CategoriaStatusEnum";
import { CategoriaUsuario } from "../Catalogo/Entity/CategoriaUsuarioEntity";
import { Curso } from "../Catalogo/Entity/CursoEntity";

export class Usuario{
    id: number;
    nome: string;
    cpf: string;
    ativo: CategoriaStatus;
    categoriaUsuario: CategoriaUsuario;
    curso: Curso;

    constructor( nome: string, cpf: string, ativo: CategoriaStatus, categoriaUsuario: CategoriaUsuario, curso: Curso){
        this.id = this.gerarId();
        this.nome = nome;
        this.cpf = cpf;
        this.ativo = ativo;
        this.categoriaUsuario = categoriaUsuario;
        this.curso = curso;
    }
    
    private gerarId(): number {
        return Date.now();
    }
}