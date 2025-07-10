export class FormatadorDate {
    adicionarDias(data: Date | string, dias: number): Date {
        const novaData = new Date(data);
        novaData.setDate(novaData.getDate() + dias);
        return novaData;
    }
    diferencaEmDias(data1: Date, data2: Date): number {
        const umDiaMs = 1000 * 60 * 60 * 24;

        const d1 = new Date(data1.getFullYear(), data1.getMonth(), data1.getDate());
        const d2 = new Date(data2.getFullYear(), data2.getMonth(), data2.getDate());

        const diffMs = d2.getTime() - d1.getTime();

        return Math.abs(Math.floor(diffMs / umDiaMs)); // pode dar negativo se data2 < data1
    }

    calcularSuspensaoAte(dataDevolucao: Date, dias: number): Date {
        const novaData = new Date(dataDevolucao);
        novaData.setDate(novaData.getDate() + dias*3);
        return novaData;
    }
}