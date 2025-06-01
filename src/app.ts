import express from 'express';
import UsuarioRouter from './routes/UsuarioRouter';
import CatalogoRouter from './routes/CatalogosRouter';
import LivrosRouter from './routes/LivrosRouter';
import EstoqueRouter from './routes/EstoqueRouter';
import EmprestimosRouter from './routes/EmprestimosRouter';

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(express.json());

app.use('/usuarios', UsuarioRouter);
app.use('/livros', LivrosRouter);
app.use('/estoque', EstoqueRouter);
app.use('/emprestimos', EmprestimosRouter);
app.use('/catalogos', CatalogoRouter);

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});