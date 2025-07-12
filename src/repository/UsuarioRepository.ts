import { Usuario } from "../model/Usuario/Entity/UsuarioEntity";
import { executarComandoSQL } from "../database/mysql";

export class UsuarioRepository {
    private static instance: UsuarioRepository;

    private constructor() {
    }

    public static getInstance(): UsuarioRepository {
        if (!this.instance) {
            this.instance = new UsuarioRepository();
        }
        return this.instance;
    }

    // private async criarTabela() {
    //     const query = `
    //         CREATE TABLE IF NOT EXISTS Usuario (
    //             id INT AUTO_INCREMENT PRIMARY KEY,
    //             nome VARCHAR(100) NOT NULL,
    //             cpf VARCHAR(11) NOT NULL UNIQUE,
    //             ativo ENUM('ATIVO', 'SUSPENSO', 'INATIVO') NOT NULL,
    //             categoriaUsuario INT NOT NULL,
    //             curso INT NOT NULL,
    //             FOREIGN KEY (categoriaUsuario) REFERENCES CategoriaUsuario(id),
    //             FOREIGN KEY (curso) REFERENCES Cursos(id)
    //         )
    //     `;
    //     try {
    //         await executarComandoSQL(query, []);
    //         console.log("Tabela Usuario verificada/criada com sucesso.");
    //     } catch (err) {
    //         console.error("Erro ao criar tabela Usuario:", err);
    //     }
    // }

    async listar(): Promise<Usuario[]> {
        const query = `SELECT * FROM Usuario`;
        try {
            const resultado = await executarComandoSQL(query, []);
            return resultado
        } catch (err) {
            console.error("Erro ao listar usuários:", err);
            return [];
        }
    }

    async listarUsuariosSuspensos(): Promise<Usuario[]> {
        const query = `SELECT * FROM Usuario WHERE ativo = 'SUSPENSO'`;
        try {
            const resultado = await executarComandoSQL(query, []);
            return resultado;
        } catch (err) {
            console.error("Erro ao listar usuários suspensos:", err);
            return [];
        }
    }

    async cadastrar(usuario: Usuario): Promise<void> {
        const query = `
            INSERT INTO Usuario (nome, cpf, ativo, categoriaUsuario, curso)
            VALUES (?, ?, ?, ?, ?)
        `;
        const params = [usuario.nome, usuario.cpf, usuario.ativo, usuario.categoriaUsuario, usuario.curso];
        return await executarComandoSQL(query, params);
    }


    async filtrarPorCampos(filtro: Partial<Usuario>): Promise<Usuario[]> {
        const condicoes: string[] = [];
        const valores: any[] = [];

        if (filtro.id !== undefined) {
            condicoes.push("id = ?");
            valores.push(filtro.id);
        }
        if (filtro.nome !== undefined) {
            condicoes.push("nome = ?");
            valores.push(filtro.nome);
        }
        if (filtro.cpf !== undefined) {
            condicoes.push("cpf = ?");
            valores.push(filtro.cpf);
        }
        if (filtro.ativo !== undefined) {
            condicoes.push("ativo = ?");
            valores.push(filtro.ativo);
        }

        const where = condicoes.length > 0 ? `WHERE ${condicoes.join(" AND ")}` : "";
        const query = `SELECT * FROM Usuario ${where}`;
        const resultado = await executarComandoSQL(query, valores);
        return resultado;
    }

    async findByCPF(cpf: string): Promise<Usuario> {
        const query = `SELECT * FROM Usuario WHERE cpf = ?`;
        const resultado = await executarComandoSQL(query, [cpf]);

        if (resultado.length === 0) {
            throw new Error("Usuário não encontrado");
        }

        return resultado[0];
    }

    async atualizar(cpfFiltro: string, dados: Partial<Usuario>): Promise<void> {
        const campos: string[] = [];
        const valores: any[] = [];

        if (dados.nome !== undefined) {
            campos.push("nome = ?");
            valores.push(dados.nome);
        }
        if (dados.ativo !== undefined) {
            campos.push("ativo = ?");
            valores.push(dados.ativo);
        }
        if (dados.categoriaUsuario !== undefined) {
            campos.push("categoriaUsuario = ?");
            valores.push(dados.categoriaUsuario);
        }
        if (dados.curso !== undefined) {
            campos.push("curso = ?");
            valores.push(dados.curso);
        }

        if (campos.length === 0) return;

        const query = `UPDATE Usuario SET ${campos.join(", ")} WHERE cpf = ?`;
        valores.push(cpfFiltro);

        const resultado = await executarComandoSQL(query, valores);
        if (resultado.affectedRows === 0) {
            throw new Error("Usuário não encontrado para atualização");
        }
        return;
    }
}