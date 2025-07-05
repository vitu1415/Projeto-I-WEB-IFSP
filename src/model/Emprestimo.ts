import { Estoque } from "./Estoque";
import { Usuario } from "./Usuario";

export class Emprestimo{
    id: number;
    usuarioId: Usuario;
    estoqueId: Estoque;
    dataEmprestimo: Date;
    dataDevolucao: Date;
    dataEntrega: Date;
    diasAtraso: number;
    suspensaoAte: Date;
    constructor( usuarioId: Usuario, estoqueId: Estoque, 
        dataEmprestimo?: Date, dataDevolucao?: Date, dataEntrega?: Date, 
        diasAtraso?: number, suspensaoAte?: Date){
        this.id = this.gerarId();
        this.usuarioId = usuarioId;
        this.estoqueId = estoqueId;
        this.dataEmprestimo = dataEmprestimo || new Date();
        this.dataDevolucao = dataDevolucao || new Date();
        this.dataEntrega = dataEntrega || new Date();
        this.diasAtraso = diasAtraso || 0;
        this.suspensaoAte = suspensaoAte || new Date();
    }
    private gerarId(): number {
        return Date.now();
    }
}