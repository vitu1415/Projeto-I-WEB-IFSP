import express from 'express';
import UsuarioRouter from './routes/UsuariosRouter';
import CatalogoRouter from './routes/CatalogosRouter';
import LivrosRouter from './routes/LivrosRouter';
import EstoqueRouter from './routes/EstoqueRouter';
import EmprestimosRouter from './routes/EmprestimosRouter';

const app = express();
const PORT = process.env.PORT ?? 3090;

app.use(express.json());

app.use('/libary/usuarios', UsuarioRouter);
app.use('/libary/livros', LivrosRouter);
app.use('/libary/estoque', EstoqueRouter);
app.use('/libary/emprestimos', EmprestimosRouter);
app.use('/libary/catalogos', CatalogoRouter);

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});