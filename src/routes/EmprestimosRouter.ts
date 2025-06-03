import { Router } from "express";
import { cadastrarEmprestimos, listarEmprestimos, registrarDevolucao } from "../controller/EmprestimosController";

const router = Router();

router.post('/', cadastrarEmprestimos);
router.get('/', listarEmprestimos);
router.put('/:id/devolucao', registrarDevolucao);

export default router;