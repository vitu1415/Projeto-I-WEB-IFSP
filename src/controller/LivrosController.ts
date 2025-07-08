import { Request, Response } from "express";
import { LivroService } from "../service/LivroService";

const livroService = new LivroService();
export async function cadastrarLivro(req: Request, res: Response) {
    try{
        const novoLivro = await livroService.criarCadastrarLivro(req.body);
        res.status(201).json(
            {
                message: "Livro cadastrado com sucesso",
                livro: novoLivro
            }
        );
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
}
export async function listarLivros(req: Request, res: Response) {
    try{
        const livros = await livroService.listarLivros(req.query);
        res.status(200).json(livros);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}
export async function detalhesLivro(req: Request, res: Response) {
    try{
        const isbn = req.params.isbn;
        const livro = await livroService.listarLivros({isbn});
        res.status(200).json(livro);
    } catch (error: any) {
        res.status(404).json({ message: error.message });
    }
}
export async function atualizarLivro(req: Request, res: Response) {
    try{
        const isbn = req.params.isbn;
        const livro = await livroService.atualizarLivro(isbn, req.body);
        res.status(200).json(
            {
                message: "Livro atualizado com sucesso",
                livro: livro
            }
        );
    } catch (error: any) {
        res.status(404).json({ message: error.message });
    }
}

//para DELETAR nao pode estar emprestado - FALTA
export async function deletarLivro(req: Request, res: Response) {
    try{
        const isbn = req.params.isbn;
        await livroService.removerLivro(isbn);
        res.status(204).json(
            {
                message: "Livro deletado com sucesso",
            }
        );
    } catch (error: any) {
        res.status(404).json({ message: error.message });
    }
}