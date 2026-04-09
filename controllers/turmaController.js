const Turma = require("../models/turma");
const Aluno = require("../models/aluno");
const Professor = require("../models/professor");

const criarTurma = async (req, res) => {
  try {
    const { 
      nome, 
      alunosIds = [], 
      professorId } = req.body;

    if (alunosIds.length > 0) {
      const quantidadeAlunos = await Aluno.countDocuments({
        _id: { $in: alunosIds },
      });

      if (quantidadeAlunos !== alunosIds.length) {
        return res.status(404).json({
          message: "Um ou mais alunos não foram encontrados.",
        });
      }
    }

    if (professorId) {
      const professor = await Professor.findById(professorId);

      if (!professor) {
        return res.status(404).json({
          message: "Professor não foi encontrado.",
        });
      }
    }

    const novaTurma = new Turma({
      nome,
      alunos: alunosIds,
      professor: professorId,
    });

    await novaTurma.save();

    res.status(201).json({
      message: "Turma criada com sucesso.",
      turma: novaTurma,
    });
  } catch (error) {
    res.status(500).json({
      message: "Erro ao criar a turma.",
      erro: error.message,
    });
  }
};

const obterTodasTurmas = async (req, res) => {
  try {
    const turmas = await Turma.find().populate("alunos professor");
    res.status(200).json(turmas);
  } catch (error) {
    res.status(500).json({
      message: "Erro ao buscar as turmas.",
      erro: error.message,
    });
  }
};

const deletarTurma = async (req, res) => {
  try {
    const { id } = req.params;

    const turma = await Turma.findByIdAndDelete(id);

    if (!turma) {
      return res.status(404).json({
        message: "Turma não encontrada.",
      });
    }

    res.status(200).json({ message: "Turma removida com sucesso."});
  } catch (error) {
    res.status(500).json({
      message: "Erro ao remover a turma.",
      erro: error.message,
    });
  }
};

const editarTurma = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, alunosIds = [], professorId } = req.body;

    const turmaExistente = await Turma.findById(id);

    if (!turmaExistente) {
      return res.status(404).json({
        message: "Turma não foi encontrada.",
      });
    }

    if (alunosIds.length > 0) {
      const quantidadeAlunos = await Aluno.countDocuments({
        _id: { $in: alunosIds },
      });

      if (quantidadeAlunos !== alunosIds.length) {
        return res.status(404).json({
          message: "Um ou mais alunos não foram encontrados.",
        });
      }
    }

    if (professorId) {
      const professor = await Professor.findById(professorId);

      if (!professor) {
        return res.status(404).json({
          message: "Professor não encontrado.",
        });
      }
    }

    const turma = await Turma.findByIdAndUpdate(
      id,
      { nome, alunos: alunosIds, professor: professorId },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      message: "Turma atualizada com sucesso.",
      turma,
    });
  } catch (error) {
    res.status(500).json({
      message: "Erro ao atualizar a turma.",
      erro: error.message,
    });
  }
};

module.exports = {
  criarTurma,
  obterTodasTurmas,
  deletarTurma,
  editarTurma,
};