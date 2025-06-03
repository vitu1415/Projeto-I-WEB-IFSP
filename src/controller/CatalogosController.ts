import { Request, Response } from "express";
import { CategoriaUsuarioService } from "../service/CategoriaUsuarioService";
import { CategoriaLivroService } from "../service/CategoriaLivroService";
import { CursoService } from "../service/CursoService";

export function listarCategoriaDeUsuario(req: Request, res: Response) {
    try {
        const service = new CategoriaUsuarioService();
        const categorias = service.listar();
        res.status(200).json(categorias);
    } catch (error) {
        console.error("Erro ao buscar categorias de Usuarios:", error);
        res.status(500).json({ message: "Erro interno do servidor" });
    }
}

export function listarCategoriaLivro(req: Request, res: Response) {
    try {
        const service = new CategoriaLivroService();
        const categorias = service.listar();
        res.status(200).json(categorias);
    } catch (error) {
        console.error("Erro ao buscar categorias de Livros:", error);
        res.status(500).json({ message: "Erro interno do servidor" });
    }
}

export function listarTiposDeCursos(req: Request, res: Response) {
    try {
        const service = new CursoService();
        const categorias = service.listar();
        res.status(200).json(categorias);
    } catch (error) {
        console.error("Erro ao buscar categorias de Cursos:", error);
        res.status(500).json({ message: "Erro interno do servidor" });
    }
}