import { EstoqueResponseDTO } from "../../Estoque/dto/EstoqueResponseDTO";
import { UsuarioResponseDTO } from "../../Usuario/dto/UsuarioResponseDTO";

export interface EmprestimoResponseDTO {
    usuario: UsuarioResponseDTO;
    estoque: EstoqueResponseDTO;
    dataEmprestimo: Date;
    dataDevolucao: Date;
    dataEntrega: Date;
    diasAtraso: number;
    suspensaoAte: Date;
}