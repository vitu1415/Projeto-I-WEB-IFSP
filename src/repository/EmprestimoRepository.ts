import { Emprestimo } from "../model/Emprestimo"

export class EmprestimoRepository{
    private static instance: EmprestimoRepository
    private emprestimos: Emprestimo[] = []
    private constructor() { }

    public static getInstance(): EmprestimoRepository {
        if (!EmprestimoRepository.instance) {
            EmprestimoRepository.instance = new EmprestimoRepository()
        }
        return EmprestimoRepository.instance
    }

    cadastrar(emprestimo: Emprestimo): void {
        this.emprestimos.push(emprestimo)
    }

    listar(): Emprestimo[] {
        return this.emprestimos
    }

    devolucaoEmprestimo(id: any): Emprestimo {
        let resultado = this.listar();
        resultado = resultado.filter(u => u.id === Number(id));
        if(!resultado){
            throw new Error("Emprestimo nao encontrado");
        }
        const dataDevolucao = new Date();
        resultado[0].dataDevolucao = dataDevolucao;
        return resultado[0];
    }
}