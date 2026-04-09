import { useEffect, useState } from "react";
import api, { setAuthToken } from "./api";

const entityConfig = {
  aluno: {
    title: "Alunos",
    endpoint: "/aluno",
    fields: [
      { name: "nome", label: "Nome", type: "text", required: true },
      { name: "idade", label: "Idade", type: "number", required: true },
    ],
    toPayload: (form) => ({
      nome: form.nome,
      idade: Number(form.idade),
    }),
    formatItem: (item) => [
      item.nome,
      `${item.idade} anos`,
      item.perfil ? `Perfil: ${item.perfil.matricula || item.perfil._id}` : "Sem perfil",
    ],
  },
  perfil: {
    title: "Perfis",
    endpoint: "/perfil",
    fields: [
      { name: "matricula", label: "Matrícula", type: "text", required: true },
      { name: "telefone", label: "Telefone", type: "text", required: true },
      { name: "endereco", label: "Endereço", type: "text", required: true },
      { name: "alunoId", label: "ID do aluno", type: "text", required: true },
    ],
    toPayload: (form) => ({
      matricula: form.matricula,
      telefone: form.telefone,
      endereco: form.endereco,
      alunoId: form.alunoId,
    }),
    formatItem: (item) => [
      item.matricula,
      item.telefone,
      item.endereco,
      item.aluno ? `Aluno: ${item.aluno.nome}` : "Sem aluno",
    ],
  },
  disciplina: {
    title: "Disciplinas",
    endpoint: "/disciplina",
    fields: [
      { name: "nome", label: "Nome", type: "text", required: true },
      { name: "descricao", label: "Descrição", type: "text" },
      { name: "dataInicio", label: "Data de início", type: "date" },
      { name: "dataFim", label: "Data final", type: "date" },
      {
        name: "tarefasIds",
        label: "IDs das tarefas",
        type: "text",
        placeholder: "Separe por vírgula",
      },
    ],
    toPayload: (form) => ({
      nome: form.nome,
      descricao: form.descricao,
      dataInicio: form.dataInicio || undefined,
      dataFim: form.dataFim || undefined,
      tarefasIds: splitIds(form.tarefasIds),
    }),
    formatItem: (item) => [
      item.nome,
      item.descricao || "Sem descrição",
      item.dataInicio ? `Início: ${formatDate(item.dataInicio)}` : "Sem data de início",
      item.dataFim ? `Fim: ${formatDate(item.dataFim)}` : "Sem data final",
      item.tarefas?.length ? `Tarefas: ${item.tarefas.map((tarefa) => tarefa.titulo).join(", ")}` : "Sem tarefas",
    ],
  },
  tarefa: {
    title: "Tarefas",
    endpoint: "/tarefa",
    fields: [
      { name: "titulo", label: "Título", type: "text", required: true },
      { name: "alunoId", label: "ID do aluno", type: "text" },
      {
        name: "disciplinasIds",
        label: "IDs das disciplinas",
        type: "text",
        placeholder: "Separe por vírgula",
      },
      { name: "concluida", label: "Concluída", type: "checkbox" },
    ],
    toPayload: (form, isEditing) => {
      const payload = {
        titulo: form.titulo,
        alunoId: form.alunoId || undefined,
        disciplinasIds: splitIds(form.disciplinasIds),
      };

      if (isEditing) {
        payload.concluida = Boolean(form.concluida);
      }

      return payload;
    },
    formatItem: (item) => [
      item.titulo,
      item.concluida ? "Concluída" : "Pendente",
      item.aluno ? `Aluno: ${item.aluno.nome}` : "Sem aluno",
      item.disciplinas?.length
        ? `Disciplinas: ${item.disciplinas.map((disciplina) => disciplina.nome).join(", ")}`
        : "Sem disciplinas",
    ],
  },
  turma: {
    title: "Turmas",
    endpoint: "/turma",
    fields: [
      { name: "nome", label: "Nome", type: "text", required: true },
      {
        name: "alunosIds",
        label: "IDs dos alunos",
        type: "text",
        placeholder: "Separe por vírgula",
      },
      { name: "professorId", label: "ID do professor", type: "text" },
    ],
    toPayload: (form) => ({
      nome: form.nome,
      alunosIds: splitIds(form.alunosIds),
      professorId: form.professorId || undefined,
    }),
    formatItem: (item) => [
      item.nome,
      item.professor ? `Professor: ${item.professor.nome}` : "Sem professor",
      item.alunos?.length ? `Alunos: ${item.alunos.map((aluno) => aluno.nome).join(", ")}` : "Sem alunos",
    ],
  },
  professor: {
    title: "Professores",
    endpoint: "/professor",
    needsAuth: true,
    fields: [
      { name: "nome", label: "Nome", type: "text", required: true },
      { name: "idade", label: "Idade", type: "number", required: true },
      {
        name: "disciplinasIds",
        label: "IDs das disciplinas",
        type: "text",
        placeholder: "Separe por vírgula",
      },
    ],
    toPayload: (form) => ({
      nome: form.nome,
      idade: Number(form.idade),
      disciplinasIds: splitIds(form.disciplinasIds),
    }),
    formatItem: (item) => [
      item.nome,
      `${item.idade} anos`,
      item.disciplinas?.length
        ? `Disciplinas: ${item.disciplinas.map((disciplina) => disciplina.nome).join(", ")}`
        : "Sem disciplinas",
    ],
  },
};

const initialLogin = { cpf: "", senha: "" };

function splitIds(value) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function formatDate(value) {
  return new Date(value).toLocaleDateString("pt-BR");
}

function buildInitialForm(fields, item) {
  return fields.reduce((accumulator, field) => {
    if (!item) {
      accumulator[field.name] = field.type === "checkbox" ? false : "";
      return accumulator;
    }

    const value = item[field.name];

    if (field.type === "checkbox") {
      accumulator[field.name] = Boolean(value);
      return accumulator;
    }

    if (field.name.endsWith("Ids")) {
      const sourceKey = field.name.replace("Ids", "");
      const relation = item[sourceKey] || item[field.name] || [];
      accumulator[field.name] = Array.isArray(relation)
        ? relation.map((entry) => (typeof entry === "string" ? entry : entry._id)).join(", ")
        : "";
      return accumulator;
    }

    if (field.name === "alunoId") {
      accumulator[field.name] = item.aluno?._id || "";
      return accumulator;
    }

    if (field.name === "professorId") {
      accumulator[field.name] = item.professor?._id || "";
      return accumulator;
    }

    if (field.type === "date" && value) {
      accumulator[field.name] = new Date(value).toISOString().slice(0, 10);
      return accumulator;
    }

    accumulator[field.name] = value ?? "";
    return accumulator;
  }, {});
}

function App() {
  const [selectedEntity, setSelectedEntity] = useState("aluno");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [editingItem, setEditingItem] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("professor_token") || "");
  const [loginForm, setLoginForm] = useState(initialLogin);
  const [form, setForm] = useState(buildInitialForm(entityConfig.aluno.fields));

  const currentEntity = entityConfig[selectedEntity];

  useEffect(() => {
    setAuthToken(token);
  }, [token]);

  useEffect(() => {
    setEditingItem(null);
    setForm(buildInitialForm(currentEntity.fields));
    loadItems(selectedEntity);
  }, [selectedEntity, token]);

  async function loadItems(entityKey) {
    const config = entityConfig[entityKey];

    if (config.needsAuth && !token) {
      setItems([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await api.get(config.endpoint);
      setItems(response.data);
    } catch (requestError) {
      setItems([]);
      setError(readError(requestError));
    } finally {
      setLoading(false);
    }
  }

  function updateForm(fieldName, value) {
    setForm((currentForm) => ({
      ...currentForm,
      [fieldName]: value,
    }));
  }

  async function handleLogin(event) {
    event.preventDefault();
    setError("");
    setMessage("");

    try {
      const response = await api.post("/auth/professor/login", loginForm);
      const nextToken = response.data.token;
      localStorage.setItem("professor_token", nextToken);
      setToken(nextToken);
      setMessage("Login realizado. Agora o módulo de professores está liberado.");
      if (selectedEntity === "professor") {
        loadItems("professor");
      }
    } catch (requestError) {
      setError(readError(requestError));
    }
  }

  function handleLogout() {
    localStorage.removeItem("professor_token");
    setToken("");
    setMessage("Token removido.");
    if (selectedEntity === "professor") {
      setItems([]);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setMessage("");

    try {
      const payload = currentEntity.toPayload(form, Boolean(editingItem));

      if (editingItem) {
        await api.put(`${currentEntity.endpoint}/${editingItem._id}`, payload);
        setMessage(`${currentEntity.title.slice(0, -1)} atualizado com sucesso.`);
      } else {
        await api.post(currentEntity.endpoint, payload);
        setMessage(`${currentEntity.title.slice(0, -1)} criado com sucesso.`);
      }

      setEditingItem(null);
      setForm(buildInitialForm(currentEntity.fields));
      loadItems(selectedEntity);
    } catch (requestError) {
      setError(readError(requestError));
    }
  }

  function startEdit(item) {
    setEditingItem(item);
    setForm(buildInitialForm(currentEntity.fields, item));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelEdit() {
    setEditingItem(null);
    setForm(buildInitialForm(currentEntity.fields));
  }

  async function handleDelete(id) {
    setError("");
    setMessage("");

    try {
      await api.delete(`${currentEntity.endpoint}/${id}`);
      setMessage("Registro removido com sucesso.");
      if (editingItem?._id === id) {
        cancelEdit();
      }
      loadItems(selectedEntity);
    } catch (requestError) {
      setError(readError(requestError));
    }
  }

  const professorBlocked = currentEntity.needsAuth && !token;

  return (
    <div className="page-shell">
      <header className="hero">
        <div className="hero-copy">
          <span className="eyebrow">Painel acadêmico</span>
          <h1>Frontend pronto para consumir sua API e publicar com Vercel + Render.</h1>
          <p>
            O painel centraliza login do professor, visualização dos dados e formulários de CRUD
            para todas as entidades do projeto.
          </p>
        </div>
        <div className="hero-card">
          <p className="hero-label">API base</p>
          <strong>{import.meta.env.VITE_API_URL || "http://localhost:5000"}</strong>
          <small>Altere com a variável `VITE_API_URL` no deploy.</small>
        </div>
      </header>

      <section className="login-panel">
        <div>
          <span className="section-tag">Acesso protegido</span>
          <h2>Login do professor</h2>
          <p>Somente o módulo de professores exige token JWT.</p>
        </div>
        <form className="login-form" onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="CPF"
            value={loginForm.cpf}
            onChange={(event) => setLoginForm((current) => ({ ...current, cpf: event.target.value }))}
          />
          <input
            type="password"
            placeholder="Senha"
            value={loginForm.senha}
            onChange={(event) => setLoginForm((current) => ({ ...current, senha: event.target.value }))}
          />
          <button type="submit">Entrar</button>
          <button type="button" className="ghost-button" onClick={handleLogout}>
            Sair
          </button>
        </form>
      </section>

      {message ? <div className="feedback success">{message}</div> : null}
      {error ? <div className="feedback error">{error}</div> : null}

      <section className="workspace">
        <aside className="sidebar">
          <span className="section-tag">Entidades</span>
          {Object.entries(entityConfig).map(([key, config]) => (
            <button
              key={key}
              className={key === selectedEntity ? "nav-button active" : "nav-button"}
              onClick={() => setSelectedEntity(key)}
              type="button"
            >
              {config.title}
            </button>
          ))}
        </aside>

        <main className="content">
          <section className="panel">
            <div className="panel-heading">
              <div>
                <span className="section-tag">Formulário</span>
                <h2>
                  {editingItem ? `Editar ${currentEntity.title.slice(0, -1)}` : `Novo ${currentEntity.title.slice(0, -1)}`}
                </h2>
              </div>
              {editingItem ? (
                <button type="button" className="ghost-button" onClick={cancelEdit}>
                  Cancelar edição
                </button>
              ) : null}
            </div>

            {professorBlocked ? (
              <div className="empty-state">
                Faça login acima para consultar e editar professores.
              </div>
            ) : (
              <form className="entity-form" onSubmit={handleSubmit}>
                {currentEntity.fields.map((field) => (
                  <label key={field.name} className={field.type === "checkbox" ? "checkbox-field" : ""}>
                    <span>{field.label}</span>
                    {field.type === "checkbox" ? (
                      <input
                        type="checkbox"
                        checked={Boolean(form[field.name])}
                        onChange={(event) => updateForm(field.name, event.target.checked)}
                      />
                    ) : (
                      <input
                        type={field.type}
                        required={field.required}
                        placeholder={field.placeholder}
                        value={form[field.name] ?? ""}
                        onChange={(event) => updateForm(field.name, event.target.value)}
                      />
                    )}
                  </label>
                ))}
                <button type="submit">{editingItem ? "Salvar alterações" : "Criar registro"}</button>
              </form>
            )}
          </section>

          <section className="panel">
            <div className="panel-heading">
              <div>
                <span className="section-tag">Listagem</span>
                <h2>{currentEntity.title}</h2>
              </div>
              <button type="button" className="ghost-button" onClick={() => loadItems(selectedEntity)}>
                Atualizar
              </button>
            </div>

            {loading ? (
              <div className="empty-state">Carregando dados...</div>
            ) : professorBlocked ? (
              <div className="empty-state">O conteúdo de professores fica disponível após autenticação.</div>
            ) : items.length === 0 ? (
              <div className="empty-state">Nenhum registro encontrado.</div>
            ) : (
              <div className="card-grid">
                {items.map((item) => (
                  <article key={item._id} className="data-card">
                    <div>
                      <span className="card-id">{item._id}</span>
                      {currentEntity.formatItem(item).map((line) => (
                        <p key={line}>{line}</p>
                      ))}
                    </div>
                    <div className="card-actions">
                      <button type="button" className="ghost-button" onClick={() => startEdit(item)}>
                        Editar
                      </button>
                      <button type="button" className="danger-button" onClick={() => handleDelete(item._id)}>
                        Excluir
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </main>
      </section>
    </div>
  );
}

function readError(error) {
  return error.response?.data?.message || error.response?.data?.erro || "Não foi possível completar a operação.";
}

export default App;
