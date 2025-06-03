import { Usuario } from "../model/Usuario";
import { UsuarioRepository } from "../repository/UsuarioRepository";

export class UsuarioService{
    private repository = UsuarioRepository.getInstance()
    cadastrarUsuario(usuarioData: any): Usuario {
        return this.repository.listar();
    }

}