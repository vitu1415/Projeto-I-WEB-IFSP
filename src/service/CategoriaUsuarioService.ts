import { CategoriaUsuario } from "../model/CategoriaUsuario";
import { CategoriaUsuarioRepository } from "../repository/CategoriaUsuarioRepository";

export class CategoriaUsuarioService {
    private repository = CategoriaUsuarioRepository.getInstance();

    async listar(): Promise<CategoriaUsuario[]> {
        const resultado = await this.repository.listar();
        return resultado
    }

    async listarPorFiltro(id: number): Promise<CategoriaUsuario[]> {
        let resultado = await this.repository.listar();
        resultado = resultado.filter(c => c.id === id);
        if (!resultado) {
            throw new Error("Categoria usuario nao encontrada");
        }
        return resultado;
    }
}