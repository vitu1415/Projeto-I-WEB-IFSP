import { Estoque } from "../model/Estoque";
import { Livro } from "../model/Livro";
import { EstoqueRepository } from "../repository/EstoqueRepository";
import { LivroService } from "./LivroService";

export class EstoqueService {
    private repository = EstoqueRepository.getInstance()
    private serviceLivro = new LivroService();


    cadastrarEstoque(estoqueData: any): Estoque {
        const { livroId, quantidade, quantidade_emprestada, disponivel } = estoqueData;

        if (!livroId) {
            throw new Error("Id do livro nao foi passado");
        }

        const estoque = new Estoque(livroId, quantidade, quantidade_emprestada, disponivel);
        this.repository.cadastrar(estoque);
        return estoque
    }

    listarEstoqueDisponivel(): Estoque[] {
        return this.repository.filtrarPorCampos({ disponivel: true });
    }

    buscarExplarEmEstoque(id: any): Livro[] {
        let livro: Livro[];
        const resultado = this.repository.findById(id);
        if (resultado) {
            livro = this.serviceLivro.listarLivros({ id: resultado.livroId.id });
            if (!livro) {
                throw new Error("Livro nao encontrado na base de dados");
            }
            return livro;
        } else {
            throw new Error("Codigo nao existe na base de dados");
        }
    }

    atualizarDisponibilidade(id: any, estoqueData: Estoque): Estoque[] {
        const { quantidade, quantidade_emprestada } = estoqueData;
        let resultado: Estoque[] = this.repository.filtrarPorCampos(id);
        if (resultado) {
            if (quantidade < quantidade_emprestada) {
                resultado[0].quantidade = quantidade;
                resultado[0].quantidade_emprestada = quantidade_emprestada;
                if (resultado[0].quantidade === resultado[0].quantidade_emprestada) {
                    resultado[0].disponivel = false;
                }
                resultado = this.repository.atualizar(id, resultado[0]);
            } else {
                if (quantidade > quantidade_emprestada) {
                    throw new Error("Quantidade nao pode ser maior que quantidade emprestada");
                } else {
                    resultado[0].quantidade = quantidade;
                    resultado[0].quantidade_emprestada = quantidade_emprestada;
                    resultado[0].disponivel = false;
                    resultado = this.repository.atualizar(id, resultado[0]);
                }
            }
        } else {
            throw new Error("Nao existe esse codigo no estoque na base de dados");
        }
        return resultado;
    }

    deletarEstoque(id: any): void {
        return this.repository.remover(id);
    }
}