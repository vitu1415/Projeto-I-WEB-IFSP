export class CategoriaUsuario{
    id: number;
    nome: string;

    constructor(id: number, nome: string){
        this.id = id;
        this.nome = nome;
    }
    private gerarId(): number {
        return Date.now();
    }
}