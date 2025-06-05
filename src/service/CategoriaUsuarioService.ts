import { CategoriaUsuario } from "../model/CategoriaUsuario";
import { CategoriaUsuarioRepository } from "../repository/CategoriaUsuarioRepository";

export class CategoriaUsuarioService {
    private repository = CategoriaUsuarioRepository.getInstance();

    listar(): CategoriaUsuario[]{
        return this.repository.listar();
    }

    listarPorFiltro(id: number): CategoriaUsuario{
        const resultado = this.repository.listar().find(c => c.id === id);
        if (!resultado) {
            throw new Error("Categoria Usuario nao encontrada");
        }
        return resultado;
    }
}