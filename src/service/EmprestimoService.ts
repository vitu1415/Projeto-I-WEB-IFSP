import { Emprestimo } from "../model/Emprestimo";
import { Estoque } from "../model/Estoque";
import { EmprestimoRepository } from "../repository/EmprestimoRepository";
import { EstoqueService } from "./EstoqueService";
import { UsuarioService } from "./UsuarioService";
export class EmmprestimoService{
    private repository = EmprestimoRepository.getInstance();
    private serviceUsuario = new UsuarioService();
    private serviceEstoque = new EstoqueService();

    cadastrarEmprestimo(emprestimoData: any): Emprestimo {
        const { usuarioId, estoqueId } = emprestimoData;
        let { dataEmprestimo, dataDevolucao, dataEntrega, dataAtraso, suspensasaoAte } = emprestimoData;

        if (!usuarioId || !estoqueId){
            throw new Error("Campos obrigatórios não preenchidos");
        }

        const validadorUsuarioExistente = this.serviceUsuario.buscarUsuario(usuarioId);
        if(!validadorUsuarioExistente){
            throw new Error("Usuário nao encontrado na base de dados");
        }

        const validadorEstoqueExistente = this.serviceEstoque.listarPorFiltro(estoqueId);
        if(validadorEstoqueExistente){
            if(validadorEstoqueExistente[0].disponivel === false){
                throw new Error("Livro indisponivel");
            }else{
                validadorEstoqueExistente[0].quantidade_emprestada = validadorEstoqueExistente[0].quantidade_emprestada + 1;
                this.serviceEstoque.atualizarDisponibilidade(estoqueId, validadorEstoqueExistente[0]);
            }
        } else{
            throw new Error("Estoque nao encontrado na base de dados");
        }

        dataEmprestimo = Date.now();
        
        this.repository.cadastrar(emprestimoData);
        return emprestimoData;
    }

    listarTodosEmprestimos(): Emprestimo[] {
        return this.repository.listar();
    }
}