const Professor = require("../models/professor");

const criarProfessor = async (req, res) => {
  try {
    const { 
      nome, 
      idade, 
      disciplinasIds = [] } = req.body;

    const novoProfessor = new Professor({
      nome,
      idade,
      disciplinas: disciplinasIds,
    });

    await novoProfessor.save();

    res.status(201).json({
      message: "Professor criado com sucesso.",
      professor: novoProfessor,
    });
  } catch (error) {
    res.status(500).json({
      message: "Erro ao criar o professor.",
      erro: error.message,
    });
  }
};

const obterTodosProfessores = async (req, res) => {
  try {
    const professores = await Professor.find().populate('disciplinas');
    res.status(200).json(professores);
  } catch (error) {
    res.status(500).json({
      message: "Erro ao buscar os professores.",
      erro: error.message,
    });
  }
};

const deletarProfessor = async (req, res) => {
  try {
    const { id } = req.params;

    const professor = await Professor.findByIdAndDelete(id);

    if (!professor) {
      return res.status(404).json({
        message: "Professor não encontrado.",
      });
    }

    res.status(200).json({
      message: "Professor removido com sucesso.",
    });
  } catch (error) {
    res.status(500).json({
      message: "Erro ao remover professor.",
      erro: error.message,
    });
  }
};

const editarProfessor = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      nome, 
      idade, 
      disciplinasIds = [] } = req.body;

    const professor = await Professor.findByIdAndUpdate(
      id,
      { nome, idade, disciplinas: disciplinasIds },
      { new: true, runValidators: true }
    );

    if (!professor) {
      return res.status(404).json({
        message: "Professor não encontrado.",
      });
    }

    res.status(200).json({
      message: "Professor atualizado com sucesso.",
      professor,
    });
  } catch (error) {
    res.status(500).json({
      message: "Erro ao atualizar professor.",
      erro: error.message,
    });
  }
};

module.exports = {
  criarProfessor,
  obterTodosProfessores,
  deletarProfessor,
  editarProfessor,
};