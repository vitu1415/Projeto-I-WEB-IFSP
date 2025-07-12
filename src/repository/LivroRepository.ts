import { Livro } from "../model/Livro/Entity/LivroEntity";
import { executarComandoSQL } from "../database/mysql";

export class LivroRepository {
    private static instance: LivroRepository;

    private constructor() {
    }

    public static getInstance(): LivroRepository {
        if (!this.instance) {
            this.instance = new LivroRepository();
        }
        return this.instance;
    }

    async listar(): Promise<Livro[]> {
        const query = `SELECT * FROM Livro`;
        try {
            const resultado = await executarComandoSQL(query, []);
            return resultado
        } catch (err) {
            console.error("Erro ao listar usuários:", err);
            return [];
        }
    }

    async cadastrar(livro: Livro): Promise<void> {
        const query = `
                INSERT INTO Livro (titulo, autor, editora, edicao, isbn, categoriaLivro)
                VALUES (?, ?, ?, ?, ?, ?)
            `;
        const params = [livro.titulo, livro.autor, livro.editora, livro.edicao, livro.isbn, livro.categoriaLivro];
        return await executarComandoSQL(query, params);
    }

    async filtrarPorCampos(filtro: Partial<Livro>): Promise<Livro[]> {
        const condicoes: string[] = [];
        const valores: any[] = [];

        if (filtro.id !== undefined) {
            condicoes.push("id = ?");
            valores.push(filtro.id);
        }
        if (filtro.titulo !== undefined) {
            condicoes.push("titulo = ?");
            valores.push(filtro.titulo);
        }
        if (filtro.autor !== undefined) {
            condicoes.push("autor = ?");
            valores.push(filtro.autor);
        }
        if (filtro.editora !== undefined) {
            condicoes.push("editora = ?");
            valores.push(filtro.editora);
        }
        if (filtro.edicao !== undefined) {
            condicoes.push("edicao = ?");
            valores.push(filtro.edicao);
        }
        if (filtro.isbn !== undefined) {
            condicoes.push("isbn = ?");
            valores.push(filtro.isbn);
        }
        if (filtro.categoriaLivro !== undefined) {
            condicoes.push("categoriaLivro = ?");
            valores.push(filtro.categoriaLivro);
        }

        const where = condicoes.length > 0 ? `WHERE ${condicoes.join(" AND ")}` : "";
        const query = `SELECT * FROM Livro ${where}`;
        const resultado = await executarComandoSQL(query, valores);
        return resultado;
    }

    async findByISBN(isbn: string): Promise<Livro> {
        const query = `SELECT * FROM Livro WHERE isbn = ?`;
        const resultado = await executarComandoSQL(query, [isbn]);

        if (resultado.length === 0) {
            throw new Error("Livro não encontrado");
        }

        return resultado[0];
    }

    async atualizar(isbnFiltro: string, dados: Partial<Livro>): Promise<void> {
        const campos: string[] = [];
        const valores: any[] = [];

        if (dados.id !== undefined) {
            campos.push("id = ?");
            valores.push(dados.id);
        }
        if (dados.titulo !== undefined) {
            campos.push("titulo = ?");
            valores.push(dados.titulo);
        }
        if (dados.autor !== undefined) {
            campos.push("autor = ?");
            valores.push(dados.autor);
        }
        if (dados.editora !== undefined) {
            campos.push("editora = ?");
            valores.push(dados.editora);
        }
        if (dados.edicao !== undefined) {
            campos.push("edicao = ?");
            valores.push(dados.edicao);
        }
        if (dados.categoriaLivro !== undefined) {
            campos.push("categoriaLivro = ?");
            valores.push(dados.categoriaLivro);
        }

        if (campos.length === 0) return;

        const query = `UPDATE Livro SET ${campos.join(", ")} WHERE isbn = ?`;
        valores.push(isbnFiltro);

        const resultado = await executarComandoSQL(query, valores);
        if (resultado.affectedRows === 0) {
            throw new Error("Livro não encontrado para atualização");
        }
        return;
    }

    async remover(isbn: any): Promise<void> {
        const query = `DELETE FROM Livro WHERE isbn = ?`;
        const resultado = await executarComandoSQL(query, [isbn]);

        if (resultado.affectedRows === 0) {
            throw new Error("Livro não encontrado para remoção");
        }
    }
}