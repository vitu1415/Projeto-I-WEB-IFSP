import express from 'express';
import UsuarioRouter from './routes/UsuariosRouter';
import CatalogoRouter from './routes/CatalogosRouter';
import LivrosRouter from './routes/LivrosRouter';
import EstoqueRouter from './routes/EstoqueRouter';
import EmprestimosRouter from './routes/EmprestimosRouter';
import { iniciarVerificacaoDeAtrasos } from './Utils/ValidadorDeAtrasos';
import { conectarBanco } from './database/mysql';

const app = express();
const PORT = process.env.PORT ?? 3090;

app.use(express.json());

app.use('/libary/usuarios', UsuarioRouter);
app.use('/libary/livros', LivrosRouter);
app.use('/libary/estoque', EstoqueRouter);
app.use('/libary/emprestimos', EmprestimosRouter);
app.use('/libary/catalogos', CatalogoRouter);

conectarBanco()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Servidor rodando na porta ${PORT}`);
            iniciarVerificacaoDeAtrasos();
        });
    })
    .catch((err) => {
        console.error('Falha ao iniciar o servidor devido a erro de banco de dados:', err);
        process.exit(1); // Encerra o processo
    });