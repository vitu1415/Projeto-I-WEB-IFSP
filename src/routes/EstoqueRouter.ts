import { Router } from "express";
import { cadastroExemplar, listarExmplaresDisponiveis, listarDetalhesExemplar, atualizarDisponibilidade, deletarExemplar } from "../controller/EstoqueController";

const router = Router();

router.post('/', cadastroExemplar);
router.get('/', listarExmplaresDisponiveis);
router.get('/:id', listarDetalhesExemplar);
router.put('/:id', atualizarDisponibilidade);
router.delete('/:id', deletarExemplar);

export default router;