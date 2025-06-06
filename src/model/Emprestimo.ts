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
        dataEmprestimo: Date, dataDevolucao: Date, dataEntrega: Date, 
        diasAtraso: number, suspensaoAte: Date){
        this.id = this.gerarId();
        this.usuarioId = usuarioId;
        this.estoqueId = estoqueId;
        this.dataEmprestimo = dataEmprestimo;
        this.dataDevolucao = dataDevolucao;
        this.dataEntrega = dataEntrega;
        this.diasAtraso = diasAtraso;
        this.suspensaoAte = suspensaoAte;
    }
    private gerarId(): number {
        return Date.now();
    }
}