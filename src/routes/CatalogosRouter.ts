import { Router } from "express";
import { listarCategoriaDeUsuario, listarCategoriaLivro,  listarTiposDeCursos } from "../controller/CatalogosController";

const router = Router();

router.get('/categorias-usuario', listarCategoriaDeUsuario);
router.get('/categorias-livro', listarCategoriaLivro);
router.get('/cursos', listarTiposDeCursos);

export default router;