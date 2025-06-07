import { Emprestimo } from "../model/Emprestimo"

export class EmprestimoRepository{
    private static instance: EmprestimoRepository
    private emprestimos: Emprestimo[] = []
    private constructor() { }

    public static getInstance(): EmprestimoRepository {
        if (!this.instance) {
            this.instance = new EmprestimoRepository()
        }
        return this.instance
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

    cadastrarAtraso(id: any, diasAtraso: number): Emprestimo {
        let resultado = this.listar();
        resultado = resultado.filter(u => u.id === Number(id));
        if(!resultado){
            throw new Error("Emprestimo nao encontrado");
        }
        resultado[0].diasAtraso = diasAtraso;
        return resultado[0];
    }

    cadastrarSuspensao(id: any, dataSuspensao: Date): Emprestimo {
        let resultado = this.listar();
        resultado = resultado.filter(u => u.id === Number(id));
        if(!resultado){
            throw new Error("Emprestimo nao encontrado");
        }
        resultado[0].suspensaoAte = dataSuspensao;
        return resultado[0];
    }

    buscarPorUsuario(id: any): Emprestimo[] {
        let resultado = this.listar();
        resultado = resultado.filter(u => u.usuarioId.cpf === id);
        return resultado;
    }
}