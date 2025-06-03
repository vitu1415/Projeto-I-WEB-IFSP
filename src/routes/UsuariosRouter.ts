import { Router } from "express";
import { ataulizarUsuario, cadastrarUsuairos, deletarUsuario, filtrarPorCPF, listarUsuarios } from "../controller/UsuariosController";

const router = Router();

router.post('/', cadastrarUsuairos);
router.get('/', listarUsuarios);
router.get('/:cpf', filtrarPorCPF);
router.put('/:cpf', ataulizarUsuario);
router.delete('/:cpf', deletarUsuario);

export default router;