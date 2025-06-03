import { Router } from "express";
import { cadastrarLivro, listarLivros, detalhesLivro, atualizarLivro, deletarLivro } from "../controller/LivrosController";

const router = Router();

router.post('/', cadastrarLivro);
router.get('/', listarLivros);
router.get('/:isbn', detalhesLivro);
router.put('/:isbn', atualizarLivro);
router.delete('/:isbn', deletarLivro);

export default router;