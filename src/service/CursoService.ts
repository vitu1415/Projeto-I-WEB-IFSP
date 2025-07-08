import { Curso } from "../model/Curso";
import { CursoRepository } from "../repository/CursoRepository";

export class CursoService {
    private repository = CursoRepository.getInstance()
    listar(): Promise<Curso[]> {
        return this.repository.listar();
    }

    async listarPorFiltro(id: any): Promise<Curso[]> {
            let resultado = await this.repository.listar();
            resultado = resultado.filter(c => c.id === id);
            if (!resultado) {
                throw new Error("Categoria usuario nao encontrada");
            }
            return resultado;
    }
}