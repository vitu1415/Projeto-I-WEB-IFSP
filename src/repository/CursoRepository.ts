import { Curso } from "../model/Curso"
import { executarComandoSQL } from "../database/mysql"

export class CursoRepository {
    private static instance: CursoRepository

    private constructor() {
        this.criarTabela();
    }
    public static getInstance(): CursoRepository {
        if (!this.instance) {
            this.instance = new CursoRepository();
        }
        return this.instance;
    }

    private async criarTabela() {
        const query = `
                CREATE TABLE IF NOT EXISTS Cursos (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    nome VARCHAR(100) NOT NULL
                )
            `;
        try {
            await executarComandoSQL(query, []);
            console.log("Tabela CategoriaLivro verificada/criada com sucesso.");
            const queryContar = `SELECT COUNT(*) as total FROM Cursos`;
            const resultado = await executarComandoSQL(queryContar, []);
            const total = resultado[0].total;

            if (total === 0) {
                const categoriasIniciais = ["ADS", "Pedagogia", "Administração"];
                for (const nome of categoriasIniciais) {
                    await executarComandoSQL(`INSERT INTO Cursos (nome) VALUES (?)`, [nome]);
                }
                console.log("Categorias fixas inseridas com sucesso.");
            }
        } catch (err) {
            console.error("Erro ao criar tabela Cursos:", err);
        }
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