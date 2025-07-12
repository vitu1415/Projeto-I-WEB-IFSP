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

    // private async criarTabela(){
    //     const query = `
    //         CREATE TABLE IF NOT EXISTS CategoriaLivro (
    //             id INT AUTO_INCREMENT PRIMARY KEY,
    //             nome VARCHAR(100) NOT NULL
    //         )
    //     `;
    //     try {
    //         await executarComandoSQL(query, []);
    //         console.log("Tabela CategoriaLivro verificada/criada com sucesso.");
    //         const queryContar = `SELECT COUNT(*) as total FROM CategoriaLivro`;
    //         const resultado = await executarComandoSQL(queryContar, []);
    //         const total = resultado[0].total;

    //         if (total === 0) {
    //             const categoriasIniciais = ["Romance", "Computação", "Letras", "Gestão"];
    //             for (const nome of categoriasIniciais) {
    //                 await executarComandoSQL(`INSERT INTO CategoriaLivro (nome) VALUES (?)`, [nome]);
    //             }
    //         console.log("Categorias fixas inseridas com sucesso.");
    //         }
    //     } catch (err) {
    //         console.error("Erro ao criar tabela CategoriaLivro:", err);
    //     }
    // }

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