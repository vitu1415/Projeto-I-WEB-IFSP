import { Curso } from "../model/Curso";
import { CursoRepository } from "../repository/CursoRepository";

export class CursoService {
    private repository = CursoRepository.getInstance()
    listar(): Curso[] {
        return this.repository.listar();
    }
}