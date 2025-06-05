import { CategoriaLivro } from "../model/CategoriaLivro"
import { CategoriaLivroRepository } from "../repository/CategoriaLivroRepository"

export class CategoriaLivroService {
    private repository = CategoriaLivroRepository.getInstance()

    listar(): CategoriaLivro[] {
        return this.repository.listar()
    }

    listarPorFiltro(id: number): CategoriaLivro{
        const resultado = this.repository.listar().find(c => c.id === id);
        if (!resultado) {
            throw new Error("Categoria livro nao encontrada");
        }
        return resultado;
    }
}