import mysql, { Connection, QueryError } from 'mysql2';

const dbConfig = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'senha1234',
    database: 'projetoWebNodeIFSP'
};

const mysqlConnection : Connection = mysql.createConnection(dbConfig);

mysqlConnection.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados: ', err );
        throw err ;
    } 
    console.log('Conexao bem - sucedida com o banco de dados MySQL');
})

export default mysqlConnection;