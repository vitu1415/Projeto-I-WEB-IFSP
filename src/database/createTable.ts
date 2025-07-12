import { executarComandoSQL } from "./mysql"

export async function createTable() {
    try {
        let query = `
            CREATE TABLE IF NOT EXISTS CategoriaLivro (
                id INT AUTO_INCREMENT PRIMARY KEY,
                nome VARCHAR(100) NOT NULL
            )
        `;
        await executarComandoSQL(query, []);
        console.log("Tabela CategoriaLivro verificada/criada com sucesso.");
        let queryContar = `SELECT COUNT(*) as total FROM CategoriaLivro`;
        let resultado = await executarComandoSQL(queryContar, []);
        let total = resultado[0].total;

        if (total === 0) {
            const categoriasIniciais = ["Romance", "Computação", "Letras", "Gestão"];
            for (const nome of categoriasIniciais) {
                await executarComandoSQL(`INSERT INTO CategoriaLivro (nome) VALUES (?)`, [nome]);
            }
            console.log("Categorias fixas inseridas com sucesso.");
        }

        query = `
                    CREATE TABLE IF NOT EXISTS CategoriaUsuario (
                        id INT AUTO_INCREMENT PRIMARY KEY,
                        nome VARCHAR(100) NOT NULL
                    )
                `;

        await executarComandoSQL(query, []);
        console.log("Tabela CategoriaUsuario verificada/criada com sucesso.");
        queryContar = `SELECT COUNT(*) as total FROM CategoriaUsuario`;
        resultado = await executarComandoSQL(queryContar, []);
        total = resultado[0].total;

        if (total === 0) {
            const categoriasIniciais = ["Aluno", "Professor", "Funcionario"];
            for (const nome of categoriasIniciais) {
                await executarComandoSQL(`INSERT INTO CategoriaUsuario (nome) VALUES (?)`, [nome]);
            }
            console.log("Categorias fixas inseridas com sucesso.");
        }

        query = `
                CREATE TABLE IF NOT EXISTS Cursos (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    nome VARCHAR(100) NOT NULL
                )
            `;

        await executarComandoSQL(query, []);
        console.log("Tabela CategoriaLivro verificada/criada com sucesso.");
        queryContar = `SELECT COUNT(*) as total FROM Cursos`;
        resultado = await executarComandoSQL(queryContar, []);
        total = resultado[0].total;

        if (total === 0) {
            const categoriasIniciais = ["ADS", "Pedagogia", "Administração"];
            for (const nome of categoriasIniciais) {
                await executarComandoSQL(`INSERT INTO Cursos (nome) VALUES (?)`, [nome]);
            }
            console.log("Categorias fixas inseridas com sucesso.");
        }

        query = `
            CREATE TABLE IF NOT EXISTS Usuario (
                id INT AUTO_INCREMENT PRIMARY KEY,
                nome VARCHAR(100) NOT NULL,
                cpf VARCHAR(11) NOT NULL UNIQUE,
                ativo ENUM('ATIVO', 'SUSPENSO', 'INATIVO') NOT NULL,
                categoriaUsuario INT NOT NULL,
                curso INT NOT NULL,
                FOREIGN KEY (categoriaUsuario) REFERENCES CategoriaUsuario(id),
                FOREIGN KEY (curso) REFERENCES Cursos(id)
            )
        `;
        await executarComandoSQL(query, []);
        console.log("Tabela Usuario verificada/criada com sucesso.");

        query = `
                CREATE TABLE IF NOT EXISTS Livro (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    titulo VARCHAR(255) NOT NULL,
                    autor VARCHAR(255) NOT NULL,
                    editora VARCHAR(255) NOT NULL,
                    edicao VARCHAR(50) NOT NULL,
                    isbn VARCHAR(20) NOT NULL UNIQUE,
                    categoriaLivro INT NOT NULL,
                    FOREIGN KEY (categoriaLivro) REFERENCES CategoriaLivro(id)
                )
            `;
        await executarComandoSQL(query, []);
        console.log("Tabela Livro verificada/criada com sucesso.");

        query = `
                CREATE TABLE IF NOT EXISTS Estoque (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    livroId INT NOT NULL,
                    quantidade INT NOT NULL,
                    quantidade_emprestada INT NOT NULL DEFAULT 0,
                    disponivel BOOLEAN NOT NULL DEFAULT TRUE,
                    FOREIGN KEY (livroId) REFERENCES Livro(id)
                )
            `;
        await executarComandoSQL(query, []);
        console.log("Tabela Estoque verificada/criada com sucesso.");

        query = `
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
        await executarComandoSQL(query, []);
        console.log("Tabela Emprestimo verificada/criada com sucesso.");
    }
    catch (err) {
        console.error("Erro ao criar tabelas:", err);
    }
}