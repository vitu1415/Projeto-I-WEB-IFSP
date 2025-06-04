import { Request, Response } from "express";
import { EstoqueService } from "../service/EstoqueService";

const estoqueService = new EstoqueService();
//campos obrigatorios: ISBN livro e codigo exemplar
export function cadastroExemplar(req: Request, res: Response) {
    try{
        const novoExemplar = estoqueService.cadastrarEstoque(req.body);
        res.status(201).json(
            {
                message: "Exemplar cadastrado com sucesso",
                exemplar: novoExemplar
            }
        );
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
}
export function listarExmplaresDisponiveis(req: Request, res: Response) {

}
export function listarDetalhesExemplar(req: Request, res: Response) {

}
export function atualizarDisponibilidade(req: Request, res: Response) {

}

//para DELETAR nao pode estar emprestado = FALTANDO
export function deletarExemplar(req: Request, res: Response) {

}