export interface EmprestimoRequestDTO {
    usuarioId: number;
    estoqueId: number;
    dataEmprestimo: Date | null;
    dataDevolucao: Date | null;
    dataEntrega: Date | null;
    diasAtraso: number | null;
    suspensaoAte: Date | null;
}