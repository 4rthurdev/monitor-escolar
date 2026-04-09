# Avaliacao Primeira Fase

Projeto com backend em Node.js + Express + MongoDB e frontend em React + Vite para gerenciamento de alunos, perfis, disciplinas, tarefas, turmas e professores.

## Estrutura

- `index.js`: inicializacao do backend
- `routes/`: rotas da API
- `controllers/`: regras de negocio
- `models/`: modelos do MongoDB
- `database/`: conexao com o banco
- `frontend/`: aplicacao React com Vite

## Funcionalidades

- CRUD de alunos
- CRUD de perfis
- CRUD de disciplinas
- CRUD de tarefas
- CRUD de turmas
- CRUD de professores
- Login de professor com JWT
- Painel frontend consumindo a API com Axios

## Tecnologias utilizadas

- Node.js
- Express
- MongoDB Atlas
- Mongoose
- JSON Web Token
- React
- Vite
- Axios

## Como executar localmente

### 1. Backend

Na raiz do projeto, execute:

```powershell
npm install
npm start
```

O backend sobe por padrao em:

```txt
http://localhost:5000
```

### 2. Frontend

Entre na pasta `frontend` e execute:

```powershell
npm.cmd install
npm.cmd run dev
```

O frontend sera iniciado em uma porta local informada pelo Vite, normalmente:

```txt
http://localhost:5173
```

## Variaveis de ambiente do frontend

O frontend usa a seguinte configuracao no Axios:

```js
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
});
```

Crie um arquivo `.env` dentro de `frontend/` com:

```env
VITE_API_URL=http://localhost:5000
```

Existe tambem um arquivo de exemplo em [frontend/.env.example](c:/Users/Arthur/Documents/AvaliacaoPrimeiraFase/frontend/.env.example).

## Autenticacao do professor

Existe uma rota de login:

```txt
POST /auth/professor/login
```

Credenciais atualmente configuradas no projeto:

- CPF: `12345678900`
- Senha: `professor123`

Ao fazer login, a API retorna um token JWT. O frontend usa esse token para liberar o modulo de professores.

## Rotas principais

- `GET /aluno`
- `POST /aluno`
- `PUT /aluno/:id`
- `DELETE /aluno/:id`
- `GET /perfil`
- `POST /perfil`
- `PUT /perfil/:id`
- `DELETE /perfil/:id`
- `GET /disciplina`
- `POST /disciplina`
- `PUT /disciplina/:id`
- `DELETE /disciplina/:id`
- `GET /tarefa`
- `POST /tarefa`
- `PUT /tarefa/:id`
- `DELETE /tarefa/:id`
- `GET /turma`
- `POST /turma`
- `PUT /turma/:id`
- `DELETE /turma/:id`
- `GET /professor`
- `POST /professor`
- `PUT /professor/:id`
- `DELETE /professor/:id`

## Deploy do backend no Render

1. No Render, clique em `New +` > `Web Service`.
2. Conecte o repositorio.
3. Configure:
   `Root Directory`: raiz do projeto atual
   `Build Command`: `npm install`
   `Start Command`: `npm start`
4. Em `Advanced`, adicione a variavel `MONGO_URI` se voce adaptar o backend para usar ambiente.
5. Clique em `Create Web Service`.
6. Copie a URL gerada, por exemplo:

```txt
https://meu-back.onrender.com
```

## Deploy do frontend na Vercel

1. Na Vercel, clique em `Add New` > `Project`.
2. Importe o mesmo repositorio.
3. Configure:
   `Root Directory`: `frontend`
   `Framework Preset`: `Vite`
4. Em `Environment Variables`, adicione:

```env
VITE_API_URL=https://meu-back.onrender.com
```

5. Clique em `Deploy`.

## Observacoes importantes

- O backend foi ajustado para usar `process.env.PORT || 5000`, o que facilita o deploy.
- O backend tambem foi ajustado para aceitar CORS, permitindo o frontend hospedado em outro dominio.
- Atualmente a conexao com MongoDB esta hardcoded em [database/db.js](c:/Users/Arthur/Documents/AvaliacaoPrimeiraFase/database/db.js), o que nao e ideal para producao.
- O mais recomendado e mover a string de conexao do MongoDB e o segredo JWT para variaveis de ambiente.

## Melhorias recomendadas

- Usar `MONGO_URI` no backend em vez de usuario e senha fixos no codigo
- Usar `JWT_SECRET` como variavel de ambiente
- Adicionar validacoes mais detalhadas no frontend
- Criar paginas separadas por entidade, se desejar uma organizacao maior

## Frontend implementado

O frontend criado nesta atividade possui:

- dashboard unica
- login do professor
- formularios de criacao e edicao
- listagem com botoes de editar e excluir
- integracao com todas as rotas principais da API
- configuracao pronta para `VITE_API_URL`

