import { Estoque } from "../model/Estoque";
import { EstoqueRepository } from "../repository/EstoqueRepository";

export class EstoqueService{
    private repository = EstoqueRepository.getInstance()

    cadastrarEstoque(estoqueData: any): Estoque {
        const { livroId, quantidade, quantidade_emprestada, disponivel } = estoqueData;

        if (!livroId){
            throw new Error("Id do livro nao foi passado");
        }

        const estoque = new Estoque(livroId, quantidade, quantidade_emprestada, disponivel);
        this.repository.cadastrar(estoque);
        return estoque
    }

    listarEstoque(estoqueData: any): Estoque[] {
        return this.repository.filtrarPorCampos(estoqueData);
    }

    BucasEstoque(id: any): Estoque {
        return this.repository.findById(id);
    }

    atualizarEstoque(id: any, estoqueData: any): Estoque[] {
        return this.repository.atualizar(id, estoqueData);
    }

    deletarEstoque(id: any): void {
        return this.repository.remover(id);
    }
}