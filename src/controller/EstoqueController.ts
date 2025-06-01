import { Request, Response } from "express";

export class EstoqueController{
    //campos obrigatorios: ISBN livro e codigo exemplar
    static async cadastroExemplar(req: Request, res: Response){
        
    }
    static async listarExmplaresDisponiveis(req: Request, res: Response){
        
    }
    static async listarDetalhesExemplar(req: Request, res: Response){
        
    }
    static async atualizarDisponibilidade(req: Request, res: Response){
        
    }

    //para DELETAR nao pode estar emprestado
    static async deletarExemplar(req: Request, res: Response){
        
    }
}