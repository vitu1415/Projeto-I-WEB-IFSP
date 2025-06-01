import { Router } from "express";
import CatalogoController from "../controller/CatalogosController";


const router = Router();

router.get('/categorias-usuario', CatalogoController.listarUsuario);
router.get('/categorias/livro', CatalogoController.listarCategoriaLivro);
router.get('/cursos', CatalogoController.listarCursos);

export default router;