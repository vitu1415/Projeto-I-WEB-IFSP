import { Curso } from "../model/Curso";
import { CursoRepository } from "../repository/CursoRepository";

export class CursoService {
    private repository = CursoRepository.getInstance()
    listar(): Curso[] {
        return this.repository.listar();
    }

    listarPorFiltro(id: number): Curso {
        const resultado = this.repository.listar().find(c => c.id === id);
        if (!resultado) {
            throw new Error("Categoria Curso nao encontrada");
        }
        return resultado;
    }
}