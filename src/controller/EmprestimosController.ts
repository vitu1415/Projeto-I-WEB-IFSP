import { Request, Response } from "express";
import { EmmprestimoService } from "../service/EmprestimoService";

const emprestimosService = new EmmprestimoService();
//validar: CPF usuairo e codigo exemplar(valdiar se sao reais) - falta
//validar regras de negocio
export async function cadastrarEmprestimos(req: Request, res: Response) {
    try{
        const novoEmprestimo = await emprestimosService.cadastrarEmprestimo(req.body);
        res.status(201).json(
            {
                message: "Emprestimo cadastrado com sucesso",
                emprestimo: novoEmprestimo
            }
        );
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
}
//mostrar ativos e historico
export async function listarEmprestimos(req: Request, res: Response) {
    try{
        const emprestimos = await emprestimosService.listarTodosEmprestimos();
        res.status(200).json(emprestimos);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }

}
export async function registrarDevolucao(req: Request, res: Response) {
    try{
        const id = req.params.id;
        const emprestimos = await emprestimosService.devolucaoEmprestimo(id);
        res.status(200).json(emprestimos);
    } catch (error: any) {
        res.status(404).json({ message: error.message });
    }
}