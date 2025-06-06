export class FormatadorDate {
    formatarData(data: Date) {
        const dia = data.getDate().toString().padStart(2, '0');
        const mes = (data.getMonth() + 1).toString().padStart(2, '0');
        const ano = data.getFullYear();
        return `${dia}/${mes}/${ano}`;
    }
    
    adicionarDias(data: Date | string, dias: number): Date {
        const novaData = new Date(data); // cria uma cópia para não modificar a original
        novaData.setDate(novaData.getDate() + dias); // soma os dias corretamente
        return novaData;
    }

}