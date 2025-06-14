import { Livro } from "./Livro";

export class Estoque {
    id: number;
    livroId: Livro;
    quantidade: number;
    quantidade_emprestada: number;
    disponivel: boolean;
    constructor( livroId: Livro, quantidade: number, quantidade_emprestada: number, disponivel: boolean){
        this.id = this.gerarId();
        this.livroId = livroId;
        this.quantidade = quantidade;
        this.quantidade_emprestada = quantidade_emprestada;
        this.disponivel = disponivel;
    }
    private gerarId(): number {
        return Date.now();
    }
}