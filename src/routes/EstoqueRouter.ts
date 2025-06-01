import { Router } from "express";
import { EstoqueController } from "../controller/EstoqueController";

const router = Router();

router.post('/', EstoqueController.cadastroExemplar);
router.get('/', EstoqueController.listarExmplaresDisponiveis);
router.get('/:codigo', EstoqueController.listarDetalhesExemplar);
router.put('/:codigo', EstoqueController.atualizarDisponibilidade);
router.delete('/:codigo', EstoqueController.deletarExemplar);

export default router;