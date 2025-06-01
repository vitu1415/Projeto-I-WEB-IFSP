import { Estoque } from "./Estoque";
import { Usuario } from "./Usuario";

export class Emprestimo{
    id: number;
    usuarioId: Usuario;
    estoqueId: Estoque;
    dataEmprestimo: Date;
    dataDevolucao: Date;
    dataEntrega: Date;
    dataAtraso: Date;
    suspensasaoAte: Date;
    constructor(id: number, usuarioId: Usuario, estoqueId: Estoque, 
        dataEmprestimo: Date, dataDevolucao: Date, dataEntrega: Date, 
        dataAtraso: Date, suspensasaoAte: Date){
        this.id = id;
        this.usuarioId = usuarioId;
        this.estoqueId = estoqueId;
        this.dataEmprestimo = dataEmprestimo;
        this.dataDevolucao = dataDevolucao;
        this.dataEntrega = dataEntrega;
        this.dataAtraso = dataAtraso;
        this.suspensasaoAte = suspensasaoAte;
    }
}