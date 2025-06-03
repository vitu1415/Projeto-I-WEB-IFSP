import { Usuario } from "../model/Usuario";
import { UsuarioRepository } from "../repository/UsuarioRepository";

export class UsuarioService {
    private repository = UsuarioRepository.getInstance()

    calcularDigitoCPF(cpfParcial: number[], fator: number): number {
        let soma = 0;
        for (let i = 0; i < cpfParcial.length; i++) {
            soma += cpfParcial[i] * (fator - i);
        }

        const resto = soma % 11;
        return resto < 2 ? 0 : 11 - resto;
    }

    ValidarCPF(cpf: string): boolean {
        let sequenciaRepetida = new Set(cpf).size === 1;
        if (cpf.length != 11 || sequenciaRepetida) {
            return false;
        }
        const cpfArray = cpf.split('').map(Number);

        const digito1 = this.calcularDigitoCPF(cpfArray.slice(0, 9), 10);
        const digito2 = this.calcularDigitoCPF(cpfArray.slice(0, 10), 11);

        return digito1 === cpfArray[9] && digito2 === cpfArray[10];
    }

    cadastrarUsuario(usuarioData: any): Usuario {
        const { id, nome, cpf, categoriaUsuario, curso } = usuarioData;
        const ativo = true;
        if (!id || !nome || !cpf || !categoriaUsuario || !curso) {
            throw new Error("esta faltando dados que sao obrigatorios");
        }

        if(!this.ValidarCPF(cpf)){
            throw new Error("CPF invalido");
        }

        const usuarioExistente = this.repository.listar().find(u => u.cpf === cpf);
        if (usuarioExistente) {
            throw new Error("CPF ja cadastrado");
        }
        const usuarioIdExistente = this.repository.listar().find(u => u.id === id);
        if (usuarioIdExistente) {
            throw new Error("Id ja cadastrado");
        }

        const usuario = new Usuario(id, nome, cpf, ativo, categoriaUsuario, curso);
        this.repository.cadastrar(usuario);
        return usuario;
    }

    listarUsuarios(): Usuario[] {
        return this.repository.listar();
    }
}