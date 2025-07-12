import { Curso } from "../model/Catalogo/Entity/CursoEntity"
import { executarComandoSQL } from "../database/mysql"

export class CursoRepository {
    private static instance: CursoRepository

    private constructor() {
    }
    public static getInstance(): CursoRepository {
        if (!this.instance) {
            this.instance = new CursoRepository();
        }
        return this.instance;
    }

    public async listar(): Promise<Curso[]> {
            const query = `SELECT * FROM Cursos`;
            try {
                const resultado = await executarComandoSQL(query, []);
                return resultado;
            } catch (err) {
                console.error("Erro ao listar cursos:", err);
                return [];
            }
    }
}