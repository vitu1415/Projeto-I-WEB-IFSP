import { Usuario } from "../model/Usuario";

export class UsuarioRepository {
    private static instance: UsuarioRepository;
    private usuarios: Usuario[] = [];

    private constructor(){}

    public static getInstance(): UsuarioRepository {
        if (!this.instance) {
            this.instance = new UsuarioRepository();
        }
        return this.instance;
    }

    public listar(): Usuario[] {
        return this.usuarios;
    }

    public cadastrar(usuario: Usuario): void {
        this.usuarios.push(usuario);
    }

    public filtrarPorCampos(usuario: any): Usuario[] {
        const { id, nome, cpf, ativo, categoriaUsuario, curso } = usuario;

        let resultado = this.listar();
        if (id !== undefined) {
            resultado = resultado.filter(u => u.id === Number(id));
        }
        if (nome !== undefined) {
            resultado = resultado.filter(u => u.nome === nome);
        }
        if (cpf !== undefined) {
            resultado = resultado.filter(u => u.cpf === cpf);
        }
        if (ativo !== undefined) {
            const ativoBool = ativo === true || ativo === 'true';
            resultado = resultado.filter(u => u.ativo === ativoBool);
        }
        if (categoriaUsuario !== undefined) {
            resultado = resultado.filter(u => u.categoriaUsuario.id === categoriaUsuario.id);
        }
        if (curso !== undefined) {
            resultado = resultado.filter(u => u.curso.id === curso.id);
        }

        return resultado;
    }

    findByCPF(cpf: string): Usuario[] {
        let resultado = this.filtrarPorCampos(cpf);
        if(resultado.some(u => u.cpf === cpf)){
            return resultado;
        } else{
            throw new Error("Usuario nao encontrado na base de dados");
        }
    }

    public atualizar(cpfFiltro: any, usuario: any): Usuario[] {
        let resultado = this.filtrarPorCampos(cpfFiltro);
        if(!resultado){
            throw new Error("Usuario nao encontrado");
        }
        const { nome, ativo, cpf, categoriaUsuario, curso } = usuario;
        if (nome !== undefined) {
            resultado[0].nome = nome;
        }
        if (ativo !== undefined) {
            resultado[0].ativo = ativo;
        }
        if (cpf !== undefined) {
            resultado[0].cpf = cpf;
        }
        if (categoriaUsuario !== undefined) {
            resultado[0].categoriaUsuario = categoriaUsuario;
        }
        if (curso !== undefined) {
            resultado[0].curso = curso;
        }

        return resultado;
    }

    public remover(cpf: any): void {
        const index = this.usuarios.findIndex(u => u.cpf === cpf);
        if (index !== -1) {
            this.usuarios.splice(index, 1);
        } else {
            throw new Error("Usuario nao encontrado");
        }
    }
}