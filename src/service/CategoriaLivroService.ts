import { CategoriaLivro } from "../model/Catalogo/Entity/CategoriaLivroEntity"
import { CategoriaLivroRepository } from "../repository/CategoriaLivroRepository"

export class CategoriaLivroService {
    private repository = CategoriaLivroRepository.getInstance()

    listar(): Promise<CategoriaLivro[]> {
        return this.repository.listar();
    }

    async listarPorFiltro(id: any): Promise<CategoriaLivro[]> {
        let resultado = await this.repository.listar();
        resultado = resultado.filter(c => c.id === id);
        if (!resultado) {
            throw new Error("Categoria livro nao encontrada");
        }
        return resultado;
    }
}