import { Router } from "express";
import { cadastroExemplar, listarExmplaresDisponiveis, listarDetalhesExemplar, atualizarDisponibilidade, deletarExemplar } from "../controller/EstoqueController";

const router = Router();

router.post('/', cadastroExemplar);
router.get('/', listarExmplaresDisponiveis);
router.get('/:codigo', listarDetalhesExemplar);
router.put('/:codigo', atualizarDisponibilidade);
router.delete('/:codigo', deletarExemplar);

export default router;