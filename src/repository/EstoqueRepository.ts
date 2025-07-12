import { Estoque } from "../model/Estoque/Entity/EstoqueEntity"
import { executarComandoSQL } from "../database/mysql";

export class EstoqueRepository {
    private static instance: EstoqueRepository

    private constructor() {
    }

    public static getInstance(): EstoqueRepository {
        if (!this.instance) {
            this.instance = new EstoqueRepository()
        }
        return this.instance
    }

    
    async listar(): Promise<Estoque[]> {
        const query = `SELECT * FROM Estoque`;
        try {
            const resultado = await executarComandoSQL(query, []);
            return resultado
        } catch (err) {
            console.error("Erro ao listar estoque:", err);
            return [];
        }
    }

    async cadastrar(estoque: Estoque): Promise<Estoque> {
        const query = `
                INSERT INTO Estoque (livroId, quantidade, quantidade_emprestada, disponivel)
                VALUES (?, ?, ?, ?)
            `;
        const params = [estoque.livroId, estoque.quantidade, estoque.quantidade_emprestada, estoque.disponivel];
        return await executarComandoSQL(query, params);
    }

    async filtrarPorCampos(filtro: Partial<Estoque>): Promise<Estoque[]> {
        const condicoes: string[] = [];
        const valores: any[] = [];

        if(filtro.id !== undefined) {
            condicoes.push("id = ?");
            valores.push(filtro.id);
        }
        if (filtro.livroId !== undefined) {
            condicoes.push("livroId = ?");
            valores.push(filtro.livroId);
        }
        if (filtro.quantidade !== undefined) {
            condicoes.push("quantidade = ?");
            valores.push(filtro.quantidade);
        }
        if (filtro.quantidade_emprestada !== undefined) {
            condicoes.push("quantidade_emprestada = ?");
            valores.push(filtro.quantidade_emprestada);
        }
        if (filtro.disponivel !== undefined) {
            condicoes.push("disponivel = ?");
            valores.push(filtro.disponivel);
        }

        const where = condicoes.length > 0 ? `WHERE ${condicoes.join(" AND ")}` : "";
        const query = `SELECT * FROM Estoque ${where}`;
        const resultado = await executarComandoSQL(query, valores);
        return resultado;
    }

    async findById(id: string): Promise<Estoque> {
        const query = `SELECT * FROM Estoque WHERE id = ?`;
        const resultado = await executarComandoSQL(query, [id]);

        if (resultado.length === 0) {
            throw new Error("Estoque não encontrado");
        }

        return resultado[0];
    }

    async atualizar(idFiltro: string, dados: Partial<Estoque>): Promise<Estoque[]> {
        const campos: string[] = [];
        const valores: any[] = [];

        if (dados.livroId !== undefined) {
            campos.push("livroId = ?");
            valores.push(dados.livroId);
        }
        if (dados.quantidade !== undefined) {
            campos.push("quantidade = ?");
            valores.push(dados.quantidade);
        }
        if (dados.quantidade_emprestada !== undefined) {
            campos.push("quantidade_emprestada = ?");
            valores.push(dados.quantidade_emprestada);
        }
        if (dados.disponivel !== undefined) {
            campos.push("disponivel = ?");
            valores.push(dados.disponivel);
        }

        if (campos.length === 0) return [];

        const query = `UPDATE Estoque SET ${campos.join(", ")} WHERE id = ?`;
        valores.push(idFiltro);

        const resultado = await executarComandoSQL(query, valores);
        if (resultado.affectedRows === 0) {
            throw new Error("Estoque não encontrado para atualização");
        }
        return resultado;
    }

    async remover(id: any): Promise<void> {
        const query = `DELETE FROM Usuario WHERE id = ?`;
        const resultado = await executarComandoSQL(query, [id]);
        if (resultado.affectedRows === 0) {
            throw new Error("Usuário não encontrado para remoção");
        }
    }
}