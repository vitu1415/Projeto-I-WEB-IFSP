export class ValidacaoCPF {
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

        const resultado: boolean = cpfArray[9] === digito1 && cpfArray[10] === digito2;

        return resultado;
    }
}