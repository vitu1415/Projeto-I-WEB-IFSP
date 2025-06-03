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
}