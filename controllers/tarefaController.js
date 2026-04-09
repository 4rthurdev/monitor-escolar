const Tarefa = require("../models/tarefa");
const Aluno = require("../models/aluno");
const Disciplina = require("../models/disciplina");

const criarTarefa = async (req, res) => {
  try {
    const { 
      titulo, 
      alunoId, 
      disciplinasIds = [] } = req.body;
    const concluida = false;

    if (alunoId) {
      const aluno = await Aluno.findById(alunoId);

      if (!aluno) {
        return res.status(404).json({
          message: "Aluno não encontrado.",
        });
      }
    }

    const novaTarefa = new Tarefa({
      titulo,
      aluno: alunoId,
      concluida,
      disciplinas: disciplinasIds,
    });

    await novaTarefa.save();

    if (disciplinasIds.length > 0) {
      await Disciplina.updateMany(
        { _id: { $in: disciplinasIds } },
        { $addToSet: { tarefas: novaTarefa._id } }
      );
    }

    res.status(201).json({
      message: "Tarefa criada com sucesso.",
      tarefa: novaTarefa,
    });
  } catch (error) {
    res.status(500).json({
      message: "Erro ao criar a tarefa.",
      erro: error.message,
    });
  }
};

const obterTodasTarefas = async (req, res) => {
  try {
    const tarefas = await Tarefa.find().populate("aluno").populate("disciplinas");
    res.status(200).json(tarefas);
  } catch (error) {
    res.status(500).json({
      message: "Erro ao buscar as tarefas.",
      erro: error.message,
    });
  }
};

const deletarTarefa = async (req, res) => {
  try {
    const { id } = req.params;

    const tarefa = await Tarefa.findByIdAndDelete(id);

    if (!tarefa) {
      return res.status(404).json({
        message: "Tarefa não foi encontrada.",
      });
    }

    await Disciplina.updateMany(
      { _id: { $in: tarefa.disciplinas } },
      { $pull: { tarefas: tarefa._id } }
    );

    res.status(200).json({ message: "Tarefa removida com sucesso."});
  } catch (error) {
    res.status(500).json({
      message: "Erro ao remover a tarefa.",
      erro: error.message,
    });
  }
};

const editarTarefa = async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, concluida, alunoId, disciplinasIds = [] } = req.body;

    const tarefaAtual = await Tarefa.findById(id);

    if (!tarefaAtual) {
      return res.status(404).json({
        message: "Tarefa não encontrada.",
      });
    }

    if (alunoId) {
      const aluno = await Aluno.findById(alunoId);

      if (!aluno) {
        return res.status(404).json({
          message: "Aluno não encontrado.",
        });
      }
    }

    await Disciplina.updateMany(
      { _id: { $in: tarefaAtual.disciplinas } },
      { $pull: { tarefas: tarefaAtual._id } }
    );

    await Disciplina.updateMany(
      { _id: { $in: disciplinasIds } },
      { $addToSet: { tarefas: tarefaAtual._id } }
    );

    const tarefa = await Tarefa.findByIdAndUpdate(
      id,
      { titulo, concluida, aluno: alunoId, disciplinas: disciplinasIds },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      message: "Tarefa atualizada com sucesso.",
      tarefa,
    });
  } catch (error) {
    res.status(500).json({
      message: "Erro ao atualizar a tarefa.",
      erro: error.message,
    });
  }
};

module.exports = {
  criarTarefa,
  obterTodasTarefas,
  deletarTarefa,
  editarTarefa,
};