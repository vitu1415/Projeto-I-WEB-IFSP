import { Livro } from "../../Livro/Entity/LivroEntity";
export class Estoque {
    id: number;
    livroId: Livro;
    quantidade: number;
    quantidade_emprestada: number;
    disponivel: boolean;
    constructor( livroId: Livro, quantidade?: number, quantidade_emprestada?: number, disponivel?: boolean){
        this.id = this.gerarId();
        this.livroId = livroId;
        this.quantidade = quantidade || 0;
        this.quantidade_emprestada = quantidade_emprestada || 0;
        this.disponivel = disponivel || false;
    }
    private gerarId(): number {
        return Date.now();
    }
}