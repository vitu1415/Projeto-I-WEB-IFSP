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
    try{
        const exemplares = estoqueService.listarEstoqueDisponivel();
        res.status(200).json(exemplares);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}
export function listarDetalhesExemplar(req: Request, res: Response) {
    try{
        const id = req.params.id;
        const exmplar = estoqueService.buscarExplarEmEstoque({id});
        res.status(200).json(exmplar);
    } catch (error: any) {
        res.status(404).json({ message: error.message });
    }
}
export function atualizarDisponibilidade(req: Request, res: Response) {
    try{
        const id = req.params.id;
        const exemplar = estoqueService.atualizarDisponibilidade(id, req.body);
        res.status(200).json(
            {
                message: "Exemplar atualizado com sucesso",
                exemplar: exemplar
            }
        );

    } catch (error: any) {
        res.status(404).json({ message: error.message });
    }
}

//para DELETAR nao pode estar emprestado = FALTANDO
export function deletarExemplar(req: Request, res: Response) {
    try{
        const id = Number(req.params.id);
        estoqueService.deletarEstoque(id);
        res.status(204).json(
            {
                message: "Exemplar deletado com sucesso",
            }
        );
    } catch (error: any) {
        res.status(404).json({ message: error.message });
    }
}