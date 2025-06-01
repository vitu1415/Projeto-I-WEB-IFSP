import { Router } from "express";
import { LivrosController } from "../controller/LivrosController";

const router = Router();

router.post('/', LivrosController.cadastrarLivro);
router.get('/', LivrosController.listarLivros);
router.get('/:isbn', LivrosController.detalhesLivro);
router.put('/:isbn', LivrosController.atualizarLivro);
router.delete('/:isbn', LivrosController.deletarLivro);

export default router;