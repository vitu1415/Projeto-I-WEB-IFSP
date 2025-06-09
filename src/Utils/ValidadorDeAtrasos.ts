import { EmmprestimoService } from "../service/EmprestimoService";
import { UsuarioService } from "../service/UsuarioService";

export function iniciarVerificacaoDeAtrasos() {
    const emprestimoService = new EmmprestimoService();
    const usuarioService = new UsuarioService();
    const intervaloUmaHora = 60 * 60 * 1000;

  setInterval(() => {
    console.log('Rodando verificação de atrasos...');
    emprestimoService.verificadorDeAtraso();
    console.log('rodando verificação de usuários suspensos...');
    usuarioService.reativarUsuariosSuspensos();
  }, intervaloUmaHora);
}
