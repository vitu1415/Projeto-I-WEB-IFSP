import { Router } from "express";
import { EmprestimosController } from "../controller/EmprestimosController";

const router = Router();

router.post('/', EmprestimosController.cadastrarEmprestimos);
router.get('/', EmprestimosController.listarEmprestimos);
router.put('/:id/devolucao', EmprestimosController.registrarDevolucao);

export default router;