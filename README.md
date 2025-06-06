# 📚 API de Biblioteca Acadêmica - IFSP

Este projeto foi desenvolvido como parte da disciplina de **Programação Web** do curso de **Análise e Desenvolvimento de Sistemas** no IFSP - Campus Boituva.

A aplicação consiste em uma **API RESTful** para gestão de biblioteca acadêmica, implementada em **TypeScript com Express.js**, seguindo a arquitetura **MVC**.

---

## 🚀 Funcionalidades

- Cadastro, listagem, edição e remoção de **usuários**
- Gerenciamento completo de **livros**
- Controle de **estoque de exemplares**
- Regras de **empréstimo e devolução de livros**
- Suspensões automáticas por **atraso ou acúmulo de penalidades**
- Validação de **CPF** de forma algorítmica
- Filtros inteligentes e respostas completas nos endpoints
- Dados persistidos em **memória (arrays)**

---

## 🧱 Tecnologias utilizadas

- [Node.js](https://nodejs.org)
- [TypeScript](https://www.typescriptlang.org/)
- [Express.js](https://expressjs.com/)
- [Nodemon](https://nodemon.io/) (ambiente de desenvolvimento)

---

## 📁 Estrutura do Projeto

```text
src/
├── controller/      # Lida com as requisições HTTP
├── model/           # Define as entidades (Livro, Estoque, etc)
├── repository/      # Simula persistência dos dados com arrays
├── service/         # Contém as regras de negócio
├── routes/          # Define os endpoints da API
├── app.ts         # Ponto de entrada da aplicação
```

---

## 🔄 Endpoints da API


URL base: `http://localhost:3000`

### 📘 Livros (`/livros`)
- `POST /` - Adicionar novo livro
- `GET /` - Listar todos os livros
- `GET /:isbn` - Detalhes de um livro
- `PUT /:isbn` - Atualizar informações
- `DELETE /:isbn` - Remover (se não estiver emprestado)

### 👤 Usuários (`/usuarios`)
- `POST /` - Criar novo usuário
- `GET /` - Listar usuários
- `GET /:cpf` - Ver um usuário
- `PUT /:cpf` - Editar dados
- `DELETE /:cpf` - Remover (se sem empréstimos)

### 📦 Estoque (`/estoque`)
- `POST /` - Adicionar exemplar
- `GET /` - Listar exemplares disponíveis
- `GET /:id` - Detalhes do exemplar
- `PUT /:id` - Atualizar disponibilidade
- `DELETE /:id` - Remover (se não estiver emprestado)

### 🔄 Empréstimos (`/emprestimos`)
- `POST /` - Registrar empréstimo
- `GET /` - Listar todos os empréstimos
- `PUT /:id/devolucao` - Registrar devolução

### 📚 Catálogos (`/catalogos`)
- `GET /categorias-usuario`
- `GET /categorias-livro`
- `GET /cursos`

---

## 📌 Regras de Negócio (Resumo)

- **CPF deve ser único e válido** (validação algorítmica)
- Usuário só pode emprestar se estiver **ativo**
- Suspensão automática por atraso (3 dias por dia de atraso)
- Limite de livros por categoria (Ex: Alunos = 3 livros por 15 dias)
- Controle de disponibilidade por exemplar
- Não é possível excluir entidades com dependências (ex: empréstimos em aberto)

---

## 🧪 Como testar

1. Clone o repositório:
\`\`\`bash
git clone https://github.com/vitu1415/Projeto-I-WEB-IFSP.git
\`\`\`

2. Instale as dependências:
\`\`\`bash
npm install
\`\`\`

3. Inicie a API:
\`\`\`bash
npm run dev
\`\`\`

4. Use ferramentas como **Postman** ou **Insomnia** para fazer requisições para os endpoints.

---

## 📸 Exemplos

### Exemplo de criação de livro:
```json
POST /livros/
{
  "titulo": "Clean Code",
  "isbn": "123456789",
  "autor": "Robert C. Martin",
  "editora": "Alta Books",
  "edicao": "1ª",
  "categoria": 1
}
```

---

## 🙋‍♂️ Sobre mim

Sou estudante de Análise e Desenvolvimento de Sistemas no IFSP, com foco em desenvolvimento backend. Este projeto me proporcionou uma base sólida em **TypeScript, Express, arquitetura MVC** e lógica de negócio.

---

## 📬 Contato

- 💼 [Meu LinkedIn](https://www.linkedin.com/in/vitor-alves-484932230/)
- 📧 vitoralves0801@gmail.com

---

## 🏁 Conclusão

Este projeto foi um ponto de partida como desenvolvedor em typescript + nodeJs. Ele me desafiou a pensar como um programador profissional: separar responsabilidades, modelar regras reais, lidar com erros e construir algo funcional, do início ao fim.

Se tiver feedbacks ou sugestões, estou 100% aberto!

