import { Emprestimo } from "../model/Emprestimo/Entity/EmprestimoEntity"
import { executarComandoSQL } from "../database/mysql";

export class EmprestimoRepository{
    private static instance: EmprestimoRepository
    private constructor() { 
        this.criarTabela()
    }

    public static getInstance(): EmprestimoRepository {
        if (!this.instance) {
            this.instance = new EmprestimoRepository()
        }
        return this.instance
    }

    private async criarTabela(){
        const query = `
            CREATE TABLE IF NOT EXISTS Emprestimo (
                id INT AUTO_INCREMENT PRIMARY KEY,
                usuarioId INT NOT NULL,
                estoqueId INT NOT NULL,
                dataEmprestimo DATETIME NOT NULL,
                dataDevolucao DATETIME,
                dataEntrega DATETIME,
                diasAtraso INT DEFAULT 0,
                suspensaoAte DATETIME,
                FOREIGN KEY (usuarioId) REFERENCES Usuario(id),
                FOREIGN KEY (estoqueId) REFERENCES Estoque(id)
            )
        `;
        try {
            await executarComandoSQL(query, []);
            console.log("Tabela Emprestimo verificada/criada com sucesso.");
        } catch (err) {
            console.error("Erro ao criar tabela Emprestimo:", err);
        }
    }

    async cadastrar(emprestimo: Emprestimo): Promise<void> {
        const query = `
            INSERT INTO Emprestimo (usuarioId, estoqueId, dataEmprestimo, dataDevolucao, dataEntrega, diasAtraso, suspensaoAte)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        const params = [
            emprestimo.usuarioId.id,
            emprestimo.estoqueId.id,
            emprestimo.dataEmprestimo,
            emprestimo.dataDevolucao,
            emprestimo.dataEntrega,
            emprestimo.diasAtraso,
            emprestimo.suspensaoAte
        ];
        return await executarComandoSQL(query, params);
    }

   async listar(): Promise<Emprestimo[]> {
        const query = `SELECT * FROM Emprestimo`;
        try {
            const resultado = await executarComandoSQL(query, []);
            return resultado;
        } catch (err) {
            console.error("Erro ao listar emprestimos:", err);
            return [];
        }
    }

    async listarEmprestimosAtrasados(): Promise<Emprestimo[]> {
        const query = `SELECT * FROM Emprestimo WHERE dataDevolucao IS NULL AND dataEmprestimo < CURDATE()`;
        try {
            const resultado = await executarComandoSQL(query, []);
            return resultado;
        } catch (err) {
            console.error("Erro ao retornar emprestimos atrasados:", err);
            return [];
        }
    }

    async filtrarPorUsuarioId(usuarioId: any): Promise<Emprestimo[]> {
        const query = `SELECT * FROM Emprestimo WHERE usuarioId = ?`;
        try {
            const resultado = await executarComandoSQL(query, [usuarioId]);
            return resultado;
        } catch (err) {
            console.error("Erro ao filtrar emprestimos por usuarioId:", err);
            return [];
        }
        
    }

    async filtrarPorCamposEstoque(filtro: Partial<Emprestimo>): Promise<Emprestimo[]> {
        const condicoes: string[] = [];
        const valores: any[] = [];

        if (filtro.id !== undefined) {
            condicoes.push("id = ?");
            valores.push(filtro.id);
        }
        if (filtro.usuarioId !== undefined) {
            condicoes.push("usuarioId = ?");
            valores.push(filtro.usuarioId);
        }
        if (filtro.estoqueId !== undefined) {
            condicoes.push("estoqueId = ?");
            valores.push(filtro.estoqueId);
        }
        if (filtro.dataEmprestimo !== undefined) {
            condicoes.push("dataEmprestimo = ?");
            valores.push(filtro.dataEmprestimo);
        }
        if (filtro.dataDevolucao !== undefined) {
            condicoes.push("dataDevolucao = ?");
            valores.push(filtro.dataDevolucao);
        }
        if (filtro.diasAtraso !== undefined) {
            condicoes.push("diasAtraso = ?");
            valores.push(filtro.diasAtraso);
        }
        if (filtro.suspensaoAte !== undefined) {
            condicoes.push("suspensaoAte = ?");
            valores.push(filtro.suspensaoAte);
        }

        const where = condicoes.length > 0 ? `WHERE ${condicoes.join(" AND ")}` : "";
        const query = `SELECT * FROM Emprestimo ${where}`;
        
        try {
            const resultado = await executarComandoSQL(query, valores);
            return resultado;
        } catch (err) {
            console.error("Erro ao filtrar emprestimos:", err);
            return [];
        }
    }

    async atualizar(id: number, dados: Partial<Emprestimo>): Promise<void> {
        const campos: string[] = [];
        const valores: any[] = [];

        if (dados.usuarioId !== undefined) {
            campos.push("usuarioId = ?");
            valores.push(dados.usuarioId);
        }
        if (dados.estoqueId !== undefined) {
            campos.push("estoqueId = ?");
            valores.push(dados.estoqueId);
        }
        if (dados.dataEmprestimo !== undefined) {
            campos.push("dataEmprestimo = ?");
            valores.push(dados.dataEmprestimo);
        }
        if (dados.dataDevolucao !== undefined) {
            campos.push("dataDevolucao = ?");
            valores.push(dados.dataDevolucao);
        }
        if (dados.diasAtraso !== undefined) {
            campos.push("diasAtraso = ?");
            valores.push(dados.diasAtraso);
        }
        if (dados.suspensaoAte !== undefined) {
            campos.push("suspensaoAte = ?");
            valores.push(dados.suspensaoAte);
        }

        if (campos.length === 0) {
            throw new Error("Nenhum campo para atualizar");
        }

        const query = `UPDATE Emprestimo SET ${campos.join(", ")} WHERE id = ?`;
        valores.push(id);

        const resultado = await executarComandoSQL(query, valores);
        if (resultado.affectedRows === 0) {
            throw new Error("Emprestimo nao encontrado para atualizacao");
        }
        return;
    }

    async devolucaoEmprestimo(id: any): Promise<Emprestimo> {
        const resultado = await this.filtrarPorCamposEstoque({ id: Number(id) });
        if (resultado.length === 0) {
            throw new Error("Emprestimo nao encontrado");
        }
        const emprestimo = resultado[0];
        emprestimo.dataDevolucao = new Date();
        await this.atualizar(emprestimo.id, emprestimo);
        return emprestimo;
    }

    async cadastrarAtraso(id: any, diasAtraso: number): Promise<Emprestimo> {
        const resultado = await this.filtrarPorCamposEstoque({ id: Number(id) });
        if (resultado.length === 0) {
            throw new Error("Emprestimo nao encontrado");
        }
        const emprestimo = resultado[0];
        emprestimo.diasAtraso = diasAtraso;
        await this.atualizar(emprestimo.id, emprestimo);
        return emprestimo;
    }

    async cadastrarSuspensao(id: any, dataSuspensao: Date): Promise<Emprestimo> {
        const resultado = await this.filtrarPorCamposEstoque({ id: Number(id) });
        if (resultado.length === 0) {
            throw new Error("Emprestimo nao encontrado");
        }
        const emprestimo = resultado[0];
        emprestimo.suspensaoAte = dataSuspensao;
        await this.atualizar(emprestimo.id, emprestimo);
        return emprestimo;
    }

    buscarPorUsuario(cpf: any): Promise<Emprestimo[]> {
        const query = `SELECT * FROM Usuario WHERE cpf = ?`;
        return executarComandoSQL(query, [cpf])
    }

    buscarPorLivro(isbn: any): Promise<Emprestimo[]> {
        const query = `SELECT * FROM Livro WHERE isbn = ?`;
        return executarComandoSQL(query, [isbn]);
    }

    BuscarPorEstoque(estoqueId: any): Promise<Emprestimo[]> {
        const query = `SELECT * FROM Estoque WHERE id = ?`;
        return executarComandoSQL(query, [estoqueId])
    }
}