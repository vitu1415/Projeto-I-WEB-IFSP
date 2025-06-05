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
        const { usuarioId, estoqueId, dataEmprestimo, dataDevolucao, dataEntrega, dataAtraso, suspensasaoAte } = emprestimoData;

        if (!usuarioId || !estoqueId){
            throw new Error("Campos obrigatórios não preenchidos");
        }

        const validadorUsuarioExistente = this.serviceUsuario.buscarUsuario(usuarioId);
        if(!validadorUsuarioExistente){
            throw new Error("Usuário nao encontrado na base de dados");
        }

        const validadorEstoqueExistente = this.serviceEstoque.buscarEstoque(estoqueId);
        if(validadorEstoqueExistente){
            if(validadorEstoqueExistente.disponivel === 0){
                throw new Error("Livro indisponivel");
            }
        } else{
            throw new Error("Estoque nao encontrado na base de dados");
        }

        
        this.repository.cadastrar(emprestimo);
        return emprestimo;
    }
}