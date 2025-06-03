import { CategoriaUsuario } from "../model/CategoriaUsuario";
import { CategoriaUsuarioRepository } from "../repository/CategoriaUsuarioRepository";

export class CategoriaUsuarioService {
    private repository = CategoriaUsuarioRepository.getInstance();

    listar(): CategoriaUsuario[]{
        return this.repository.listar();
    }
}