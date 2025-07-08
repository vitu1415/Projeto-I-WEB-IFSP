import { CategoriaUsuario } from "../model/CategoriaUsuario";
import { executarComandoSQL } from "../database/mysql";

export class CategoriaUsuarioRepository {
    private static instance: CategoriaUsuarioRepository

    private constructor(){
        this.criarTabela();
    }

    public static getInstance(): CategoriaUsuarioRepository {
        if (!this.instance) {
            this.instance = new CategoriaUsuarioRepository();
        }
        return this.instance;
    }

    private async criarTabela() {
        const query = `
                    CREATE TABLE IF NOT EXISTS CategoriaUsuario (
                        id INT AUTO_INCREMENT PRIMARY KEY,
                        nome VARCHAR(100) NOT NULL
                    )
                `;
                try {
                    await executarComandoSQL(query, []);
                    console.log("Tabela CategoriaUsuario verificada/criada com sucesso.");
                    const queryContar = `SELECT COUNT(*) as total FROM CategoriaUsuario`;
                    const resultado = await executarComandoSQL(queryContar, []);
                    const total = resultado[0].total;
        
                    if (total === 0) {
                        const categoriasIniciais = ["Aluno", "Professor", "Funcionario"];
                        for (const nome of categoriasIniciais) {
                            await executarComandoSQL(`INSERT INTO CategoriaUsuario (nome) VALUES (?)`, [nome]);
                        }
                    console.log("Categorias fixas inseridas com sucesso.");
                    }
                } catch (err) {
                    console.error("Erro ao criar tabela CategoriaUsuario:", err);
                }
            }
     
    public async listar(): Promise<CategoriaUsuario[]> {
            const query = `SELECT * FROM CategoriaUsuario`;
            try {
                const resultado = await executarComandoSQL(query, []);
                return resultado;
            } catch (err) {
                console.error("Erro ao listar categorias:", err);
                return [];
            }
        }
    }