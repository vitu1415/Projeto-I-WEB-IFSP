import { CategoriaUsuario } from "../model/Catalogo/Entity/CategoriaUsuarioEntity";
import { executarComandoSQL } from "../database/mysql";

export class CategoriaUsuarioRepository {
    private static instance: CategoriaUsuarioRepository

    private constructor(){
    }

    public static getInstance(): CategoriaUsuarioRepository {
        if (!this.instance) {
            this.instance = new CategoriaUsuarioRepository();
        }
        return this.instance;
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