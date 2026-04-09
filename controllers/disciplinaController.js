const Disciplina = require("../models/disciplina");
const Tarefa = require("../models/tarefa");

const criarDisciplina = async (req, res) => {
  try {
    const { 
      nome, 
      descricao, 
      dataInicio, 
      dataFim, 
      tarefasIds = [] } = req.body;

    const novaDisciplina = new Disciplina({
      nome,
      descricao,
      dataInicio,
      dataFim,
      tarefas: tarefasIds,
    });

    await novaDisciplina.save();

    if (tarefasIds.length > 0) {
      await Tarefa.updateMany(
        { _id: { $in: tarefasIds } },
        { $addToSet: { disciplinas: novaDisciplina._id } }
      );
    }

    res.status(201).json({
      message: "Disciplina criada com sucesso.",
      disciplina: novaDisciplina,
    });
  } catch (error) {
    res.status(500).json({
      message: "Erro ao criar disciplina.",
      erro: error.message,
    });
  }
};

const obterTodasDisciplinas = async (req, res) => {
  try {
    const disciplinas = await Disciplina.find().populate("tarefas");
    res.json(disciplinas);
  } catch (error) {
    res.status(500).json({
      message: "Erro ao buscar disciplinas.",
      erro: error.message,
    });
  }
};

const deletarDisciplina = async (req, res) => {
  try {
    const { id } = req.params;

    const disciplina = await Disciplina.findByIdAndDelete(id);

    if (!disciplina) {
      return res.status(404).json({
        message: "Disciplina nao encontrada.",
      });
    }

    await Tarefa.updateMany(
      { _id: { $in: disciplina.tarefas } },
      { $pull: { disciplinas: disciplina._id } }
    );

    res.status(200).json({ message: "Disciplina removida com sucesso."});
  } catch (error) {
    res.status(500).json({
      message: "Erro ao remover disciplina.",
      erro: error.message,
    });
  }
};

const editarDisciplina = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, descricao, dataInicio, dataFim, tarefasIds = [] } = req.body;

    const disciplinaAtual = await Disciplina.findById(id);

    if (!disciplinaAtual) {
      return res.status(404).json({
        message: "Disciplina não encontrada.",
      });
    }

    await Tarefa.updateMany(
      { _id: { $in: disciplinaAtual.tarefas } },
      { $pull: { disciplinas: disciplinaAtual._id } }
    );

    await Tarefa.updateMany(
      { _id: { $in: tarefasIds } },
      { $addToSet: { disciplinas: disciplinaAtual._id } }
    );

    const disciplina = await Disciplina.findByIdAndUpdate(
      id,
      { nome, descricao, dataInicio, dataFim, tarefas: tarefasIds },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      message: "Disciplina atualizada com sucesso.",
      disciplina,
    });
  } catch (error) {
    res.status(500).json({
      message: "Erro ao atualizar disciplina.",
      erro: error.message,
    });
  }
};

module.exports = {
  criarDisciplina,
  obterTodasDisciplinas,
  deletarDisciplina,
  editarDisciplina,
};