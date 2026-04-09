const Perfil = require("../models/perfil");
const Aluno = require("../models/aluno");

const criarPerfil = async (req, res) => {
  try {
    const { 
      matricula, 
      telefone, 
      endereco, 
      alunoId } = req.body;

    const aluno = await Aluno.findById(alunoId);

    if (!aluno) {
      return res.status(404).json({
        message: "Aluno não encontrado.",
      });
    }

    const novoPerfil = new Perfil({
      matricula,
      telefone,
      endereco,
      aluno: alunoId,
    });

    await novoPerfil.save();

    await Aluno.updateOne(
      { _id: alunoId },
      { $set: { perfil: novoPerfil._id } }
    );

    res.status(201).json({
      message: "Perfil criado com sucesso.",
      perfil: novoPerfil,
    });
  } catch (error) {
    res.status(500).json({
      message: "Erro ao criar o perfil.",
      erro: error.message,
    });
  }
};

const obterTodosPerfis = async (req, res) => {
  try {
    const perfis = await Perfil.find().populate("aluno");
    res.status(200).json(perfis);
  } catch (error) {
    res.status(500).json({
      message: "Erro ao buscar os perfis.",
      erro: error.message,
    });
  }
};

const deletarPerfil = async (req, res) => {
  try {
    const { id } = req.params;

    const perfil = await Perfil.findByIdAndDelete(id);

    if (!perfil) {
      return res.status(404).json({
        message: "Perfil não encontrado.",
      });
    }

    await Aluno.updateOne(
      { _id: perfil.aluno },
      { $unset: { perfil: "" } }
    );

    res.status(200).json({ message: "Perfil removido com sucesso."});
  } catch (error) {
    res.status(500).json({
      message: "Erro ao remover perfil.",
      erro: error.message,
    });
  }
};

const editarPerfil = async (req, res) => {
  try {
    const { id } = req.params;
    const { matricula, telefone, endereco, alunoId } = req.body;

    const perfilAtual = await Perfil.findById(id);

    if (!perfilAtual) {
      return res.status(404).json({
        message: "Perfil não encontrado.",
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

    const perfil = await Perfil.findByIdAndUpdate(
      id,
      { matricula, telefone, endereco, aluno: alunoId },
      { new: true, runValidators: true }
    );

    if (perfilAtual.aluno && String(perfilAtual.aluno) !== String(alunoId)) {
      await Aluno.updateOne(
        { _id: perfilAtual.aluno },
        { $unset: { perfil: "" } }
      );
    }

    if (alunoId) {
      await Aluno.updateOne(
        { _id: alunoId },
        { $set: { perfil: perfil._id } }
      );
    }

    res.status(200).json({
      message: "Perfil atualizado com sucesso.",
      perfil,
    });
  } catch (error) {
    res.status(500).json({
      message: "Erro ao atualizar perfil.",
      erro: error.message,
    });
  }
};

module.exports = {
  criarPerfil,
  obterTodosPerfis,
  deletarPerfil,
  editarPerfil,
};