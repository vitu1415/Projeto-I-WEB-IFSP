import express from 'express';
import { iniciarVerificacaoDeAtrasos } from './Utils/ValidadorDeAtrasos';
import { conectarBanco } from './database/mysql';

const PORT = process.env.PORT || 3090;

conectarBanco()
    .then(() => {
        const app = express();
        app.use(express.json());

        const UsuarioRouter = require('./routes/UsuariosRouter').default;
        const CatalogoRouter = require('./routes/CatalogosRouter').default;
        const LivrosRouter = require('./routes/LivrosRouter').default;
        const EstoqueRouter = require('./routes/EstoqueRouter').default;
        const EmprestimosRouter = require('./routes/EmprestimosRouter').default;

        app.use('/libary/usuarios', UsuarioRouter);
        app.use('/libary/livros', LivrosRouter);
        app.use('/libary/estoque', EstoqueRouter);
        app.use('/libary/emprestimos', EmprestimosRouter);
        app.use('/libary/catalogos', CatalogoRouter);

        app.listen(PORT, () => {
            console.log(`Servidor rodando na porta ${PORT}`);
            iniciarVerificacaoDeAtrasos();
        });
    })
    .catch((err) => {
        console.error('Falha ao iniciar o servidor devido a erro de banco de dados:', err);
        process.exit(1);
    });