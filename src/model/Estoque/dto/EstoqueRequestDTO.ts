export interface EstoqueRequestDTO {
    livroId: number;
    quantidade: number;
    quantidade_emprestada: number;
    disponivel: boolean;
}