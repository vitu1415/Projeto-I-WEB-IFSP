import { LivroResponseDTO } from "../../Livro/dto/LivroResponseDTO";

export interface EstoqueResponseDTO {
    livroId: LivroResponseDTO;
    quantidade: number;
    quantidade_emprestada: number;
    disponivel: boolean;
}