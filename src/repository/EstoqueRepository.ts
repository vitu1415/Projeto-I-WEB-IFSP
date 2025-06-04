import { Estoque } from "../model/Estoque"

export class EstoqueRepository {
    private static instance: EstoqueRepository
    private estoques: Estoque[] = []
    private constructor() { }

    public static getInstance(): EstoqueRepository {
        if (!EstoqueRepository.instance) {
            EstoqueRepository.instance = new EstoqueRepository()
        }
        return EstoqueRepository.instance
    }

    listar(): Estoque[] {
        return this.estoques
    }

    cadastrar(estoque: Estoque): void {
        this.estoques.push(estoque)
    }

    filtrarPorCampos(estoque: any): Estoque[] {
        const { id, livroId, quantidade, quantidade_emprestada, disponivel } = estoque;

        let resultado = this.listar();
        if (id !== undefined) {
            resultado = resultado.filter(u => u.id === Number(id));
        }
        if (livroId !== undefined) {
            resultado = resultado.filter(u => u.livroId.id === livroId.id);
        }
        if (quantidade !== undefined) {
            resultado = resultado.filter(u => u.quantidade === quantidade);
        }
        if (quantidade_emprestada !== undefined) {
            resultado = resultado.filter(u => u.quantidade_emprestada === quantidade_emprestada);
        }
        if (disponivel !== undefined) {
            resultado = resultado.filter(u => u.disponivel === disponivel);
        }

        return resultado;
    }

    findById(id: number): Estoque {
        const estoque = this.estoques.find(u => u.id === id);
        if (!estoque) {
            throw new Error("Estoque nao encontrado na base de dados");
        }
        return estoque;
    }

    atualizar(id: number, estoque: any): Estoque[] {
        const estoqueEncontrado = this.filtrarPorCampos(id);
        if(!estoqueEncontrado) {
            throw new Error("Estoque nao encontrado na base de dados");
        }
        const { livroId, quantidade, quantidade_emprestada, disponivel } = estoque;
        if (livroId !== undefined) {
            estoqueEncontrado[0].livroId = livroId;
        }
        if (quantidade !== undefined) {
            estoqueEncontrado[0].quantidade = quantidade;
        }
        if (quantidade_emprestada !== undefined) {
            estoqueEncontrado[0].quantidade_emprestada = quantidade_emprestada;
        }
        if (disponivel !== undefined) {
            estoqueEncontrado[0].disponivel = disponivel;
        }
        return this.estoques;
    }

    remover(id: any): void {
        const index = this.estoques.findIndex(u => u.id === id);
        if (index !== -1) {
            this.estoques.splice(index, 1);
        } else {
            throw new Error("Estoque nao encontrado");
        }
    }
}