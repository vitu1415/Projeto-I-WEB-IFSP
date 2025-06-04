import { Request, Response } from "express";
import { UsuarioService } from "../service/UsuarioService";
import { get } from "http";

const usuarioService = new UsuarioService();
export function cadastrarUsuairos(req: Request, res: Response) {
    try {
        const novoUsuario = usuarioService.cadastrarUsuario(req.body);
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
export function listarUsuarios(req: Request, res: Response) {
    try{
        const usuarios = usuarioService.listarUsuarios(req.query);
        res.status(200).json(usuarios);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}
export function filtrarPorCPF(req: Request, res: Response) {

}
export function ataulizarUsuario(req: Request, res: Response) {

}

//so deletar caso nao tenha nenhum emprestimo no nome
export function deletarUsuario(req: Request, res: Response) {

}