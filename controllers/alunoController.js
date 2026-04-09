const Aluno = require("../models/aluno");

const criarAluno = async (req, res) => {
  try {
    const { 
      nome, 
      idade } = req.body;

    const novoAluno = new Aluno({
      nome,
      idade,
    });
    await novoAluno.save();

    res.status(201).json({
      message: "Aluno criado com sucesso.",
      aluno: novoAluno,
    });
  } catch (error) {
    res.status(500).json({
      message: "Erro ao criar o aluno.",
      erro: error.message,
    });
  }
};

const obterTodosAlunos = async (req, res) => {
  try {
    const alunos = await Aluno.find().populate("perfil");
    res.json(alunos);
  } catch (error) {
    res.status(500).json({
      message: "Erro ao buscar os alunos.",
      erro: error.message,
    });
  }
};

const deletarAluno = async (req, res) => {
  try {
    const { id } = req.params;

    const aluno = await Aluno.findByIdAndDelete(id);

    if (!aluno) {
      return res.status(404).json({
        message: "Aluno não encontrado.",
      });
    }

    res.status(200).json({ message: "Aluno removido com sucesso." });
  } catch (error) {
    res.status(500).json({
      message: "Erro ao remover aluno.",
      erro: error.message,
    });
  }
};

const editarAluno = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, idade } = req.body;

    const aluno = await Aluno.findByIdAndUpdate(
      id,
      { nome, idade },
      { new: true, runValidators: true }
    );

    if (!aluno) {
      return res.status(404).json({
        message: "Aluno não foi encontrado.",
      });
    }

    res.status(200).json({
      message: "Aluno atualizado com sucesso.",
      aluno,
    });
  } catch (error) {
    res.status(500).json({
      message: "Erro ao atualizar aluno.",
      erro: error.message,
    });
  }
};

module.exports = {
  obterTodosAlunos,
  criarAluno,
  deletarAluno,
  editarAluno,
};