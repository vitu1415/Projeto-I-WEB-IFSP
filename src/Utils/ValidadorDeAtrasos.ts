import { EmmprestimoService } from "../service/EmprestimoService";

export function iniciarVerificacaoDeAtrasos() {
    const emprestimoService = new EmmprestimoService();
    const intervaloEmMilissegundos = 60 * 60 * 1000;

  setInterval(() => {
    console.log('Rodando verificação de atrasos...');
    emprestimoService.verificadorDeAtraso();
  }, intervaloEmMilissegundos);
}
