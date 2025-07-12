import { CategoriaLivro } from "../model/Catalogo/Entity/CategoriaLivroEntity";
import { executarComandoSQL } from "../database/mysql";

export class CategoriaLivroRepository {
    private static instance: CategoriaLivroRepository;

    private constructor(){
    }

    public static getInstance(): CategoriaLivroRepository {
        if (!this.instance) {
            this.instance = new CategoriaLivroRepository();
        }
        return this.instance;
    }

    public async listar(): Promise<CategoriaLivro[]> {
        const query = `SELECT * FROM CategoriaLivro`;
        try {
            const resultado = await executarComandoSQL(query, []);
            return resultado;
        } catch (err) {
            console.error("Erro ao listar categorias:", err);
            return [];
        }
    }

}