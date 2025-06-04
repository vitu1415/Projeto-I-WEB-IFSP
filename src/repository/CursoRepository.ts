import { Curso } from "../model/Curso"

export class CursoRepository{
    private static instance: CursoRepository
    private cursos: Curso[] = []

    private constructor(){
        this.cursos.push(new Curso(1, "ADS"))
        this.cursos.push(new Curso(2, "Pedagogia"))
        this.cursos.push(new Curso(3, "Administração"))
    }
    public static getInstance(): CursoRepository {
        if (!this.instance) {
            this.instance = new CursoRepository();
        }
        return this.instance;
    }

    listar(): Curso[] {
        return this.cursos;
    }
}