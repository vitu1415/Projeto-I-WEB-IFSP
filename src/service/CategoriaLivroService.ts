import { CategoriaLivro } from "../model/CategoriaLivro"
import { CategoriaLivroRepository } from "../repository/CategoriaLivroRepository"

export class CategoriaLivroService {
    private repository = CategoriaLivroRepository.getInstance()

    async listar(): Promise<CategoriaLivro[]> {
        const resultado = await this.repository.listar();
        return resultado
    }

    async listarPorFiltro(id: number): Promise<CategoriaLivro[]> {
        let resultado = await this.repository.listar();
        resultado = resultado.filter(c => c.id === id);
        if (!resultado) {
            throw new Error("Categoria livro nao encontrada");
        }
        return resultado;
    }
}