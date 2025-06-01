import { Router } from "express";
import { UsuariosController } from "../controller/UsuariosController";

const router = Router();

router.post('/', UsuariosController.cadastrarUsuairos);
router.get('/', UsuariosController.listarUsuarios);
router.get('/:cpf', UsuariosController.filtrarPorCPF);
router.put('/:cpf', UsuariosController.ataulizarUsuario);
router.delete('/:cpf', UsuariosController.deletarUsuario);

export default router;