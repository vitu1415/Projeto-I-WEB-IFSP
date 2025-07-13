import { EmprestimoService } from "../service/EmprestimoService";
import { UsuarioService } from "../service/UsuarioService";

export function iniciarVerificacaoDeAtrasos() {
    const emprestimoService = new EmprestimoService();
    const usuarioService = new UsuarioService();
    const intervaloUmaHora = 60 * 60 * 1000;

  setInterval(async () => {
    console.log('Rodando verificação de atrasos...');
    await emprestimoService.verificadorDeAtraso();
    console.log('rodando verificação de usuários suspensos...');
    await usuarioService.reativarUsuariosSuspensos();
  }, intervaloUmaHora);
}
