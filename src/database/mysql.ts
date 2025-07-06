import mysql, { Connection, QueryError } from 'mysql2';

const dbConfig = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'senha1234',
    database: 'projetoWebNodeIFSP'
};

let mysqlConnection: Connection;;

export function conectarBanco(): Promise<Connection> {
    return new Promise((resolve, reject) => {
        mysqlConnection = mysql.createConnection(dbConfig);

        mysqlConnection.connect((err) => {
            if (err) {
                console.error('Erro ao conectar ao banco de dados:', err);
                return reject(err);
            }
            console.log('Conexão bem-sucedida com o banco de dados MySQL');
            resolve(mysqlConnection);
        });
    });
}

export function executarComandoSQL(query: string, valores: any[]): Promise<any> {
    return new Promise((resolve, reject) => {
        mysqlConnection .query(query, valores, (err, resultado) => {
            if(err) {
                console.error('Erro ao executar a query .', err);
                reject(err);
            }
        resolve(resultado);
        }) ;
    });
}