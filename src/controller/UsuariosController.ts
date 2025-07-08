import { Request, Response } from "express";
import { UsuarioService } from "../service/UsuarioService";
import { get } from "http";

const usuarioService = new UsuarioService();
export async function cadastrarUsuairos(req: Request, res: Response) {
    try {
        const novoUsuario = await usuarioService.cadastrarUsuario(req.body);
        res.status(201).json(
            {
                message: "Usuario cadastrado com sucesso",
                usuario: novoUsuario
            }
        );
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
}

//filtro de query
export async function listarUsuarios(req: Request, res: Response) {
    try{
        const usuarios = await usuarioService.listarUsuarios(req.query);
        res.status(200).json(usuarios);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}
export async function filtrarPorCPF(req: Request, res: Response) {
    try{
        const cpf = req.params.cpf;
        const usuarios = await usuarioService.listarUsuarios({cpf});
        res.status(200).json(usuarios);
    } catch (error: any) {
        res.status(404).json({ message: error.message });
    }
}
export async function ataulizarUsuario(req: Request, res: Response) {
    try{
        const cpf = req.params.cpf;
        const usuario = await usuarioService.atualizarUsuario(cpf, req.body);
        res.status(200).json(
            {
                message: "Usuario atualizado com sucesso",
                usuario: usuario
            }
        );
    } catch (error: any) {
        res.status(404).json({ message: error.message });
    }
}

//so deletar caso nao tenha nenhum emprestimo no nome - FALTA
export async function deletarUsuario(req: Request, res: Response) {
    try{
        const cpf = req.params.cpf;
        await usuarioService.deletarUsuario(cpf);
        res.status(204).json(
            {
                message: "Usuario deletado com sucesso",
            }
        );
    } catch (error: any) {
        res.status(404).json({ message: error.message });
    }
}