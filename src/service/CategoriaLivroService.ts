import { CategoriaLivro } from "../model/CategoriaLivro"
import { CategoriaLivroRepository } from "../repository/CategoriaLivroRepository"

export class CategoriaLivroService {
    private repository = CategoriaLivroRepository.getInstance()

    listar(): CategoriaLivro[] {
        return this.repository.listar()
    }
}