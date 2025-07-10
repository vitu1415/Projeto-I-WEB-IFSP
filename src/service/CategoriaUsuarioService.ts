import { CategoriaUsuario } from "../model/Catalogo/Entity/CategoriaUsuarioEntity";
import { CategoriaUsuarioRepository } from "../repository/CategoriaUsuarioRepository";

export class CategoriaUsuarioService {
    private repository = CategoriaUsuarioRepository.getInstance();

    listar(): Promise<CategoriaUsuario[]> {
        return this.repository.listar();
    }

    async listarPorFiltro(id: any): Promise<CategoriaUsuario[]> {
        let resultado = await this.repository.listar();
        resultado = resultado.filter(c => c.id === id);
        if (!resultado) {
            throw new Error("Categoria usuario nao encontrada");
        }
        return resultado;
    }
}