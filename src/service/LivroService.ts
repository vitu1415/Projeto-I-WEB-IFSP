import { Livro } from "../model/Livro/Entity/LivroEntity";
import { LivroResponseDTO } from "../model/Livro/dto/LivroResponseDTO";
import { LivroRepository } from "../repository/LivroRepository";
import { CategoriaLivroService } from "./CategoriaLivroService";
import { EmprestimoService } from "./EmprestimoService";
import { EstoqueService } from "./EstoqueService";

export class LivroService {
    private repository = LivroRepository.getInstance()
    private categoriaLivroService = new CategoriaLivroService();

    async criarCadastrarLivro(livroData: any): Promise<LivroResponseDTO[]> {
        const { titulo, isbn, autor, edicao, editora } = livroData;
        let { categoriaLivro } = livroData;
        if (!titulo || !isbn || !autor || !edicao || !editora || !categoriaLivro) {
            throw new Error("esta faltando dados que sao obrigatorios");
        }

        const livroExistente = await this.repository.filtrarPorCampos({isbn});
        if (livroExistente.length > 0) {
            throw new Error("ISBN ja cadastrado");
        }

        const livroSequeciaExistente = await this.repository.filtrarPorCampos({ autor, editora, edicao });
        if (livroSequeciaExistente.length > 0) {
            throw new Error("Essa sequencia de autor, editora, edicao ja foi cadastrada");
        }

        categoriaLivro = await this.categoriaLivroService.listarPorFiltro(categoriaLivro);
        if (!categoriaLivro) {
            throw new Error("Categoria livro nao encontrada");
        }

        const livro = new Livro(titulo, autor, editora, edicao, isbn, categoriaLivro[0].id);
        const resultado:any = await this.repository.cadastrar(livro);
        return await this.listarLivros({ id: resultado.insertId });
    }

    async listarLivros(livroData: any): Promise<any[]> {
        let livros: Livro[];

        if (livroData === undefined || Object.keys(livroData).length === 0) {
            livros = await this.repository.listar();
        } else{
            livros = await this.repository.filtrarPorCampos(livroData);
        }

        const livrosCompletos = await Promise.all(
            livros.map(async (l) => {
                const categoria = await this.categoriaLivroService.listarPorFiltro(l.categoriaLivro);
                return {
                    id: l.id,
                    titulo: l.titulo,
                    autor: l.autor,
                    editora: l.editora,
                    edicao: l.edicao,
                    isbn: l.isbn,
                    categoriaLivro: {
                        id: categoria[0].id,
                        nome: categoria[0].nome
                    }
                };
            })
        );
        return livrosCompletos;
    }

    buscarLivroPorISBN(isbn: any): Promise<Livro> {
        return this.repository.findByISBN(isbn);
    }

    async atualizarLivro(isbnFiltro: any, livro: any): Promise<any[]> {
        let { categoriaLivro } = livro;
        if (categoriaLivro) {
            categoriaLivro = await this.categoriaLivroService.listarPorFiltro(categoriaLivro.id);
            if (!categoriaLivro) {
                throw new Error("Categoria livro nao encontrada");
            }
            livro.categoriaLivro = categoriaLivro;
        }
        await this.repository.atualizar(isbnFiltro, livro);
        return await this.listarLivros({ isbn: isbnFiltro });
    }

    async removerLivro(isbn: any): Promise<void> {
        const service = new EstoqueService();
        let resultado = await this.repository.filtrarPorCampos({ isbn });
        if (resultado.length === 0) {
            throw new Error("Livro nao encontrado na base de dados");
        }
        await service.validacaoParaDesativarEstoque(resultado[0].id);
        return;
    }
}