const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/nome-do-banco-de-dados', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('Conexão com o MongoDB estabelecida'))
  .catch(err => console.error('Erro ao conectar ao MongoDB:', err));

module.exports = mongoose.connection;

const mongoose = require('mongoose');

const exemploSchema = new mongoose.Schema({
  nome: String,
  idade: Number
});

const Exemplo = mongoose.model('Exemplo', exemploSchema);

module.exports = Exemplo;

const express = require('express');
const router = express.Router();
const Exemplo = require('./exemploModel');

// Rota para obter todos os exemplos
router.get('/exemplos', async (req, res) => {
  try {
    const exemplos = await Exemplo.find();
    res.json(exemplos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Rota para obter um exemplo específico
router.get('/exemplos/:id', async (req, res) => {
  try {
    const exemplo = await Exemplo.findById(req.params.id);
    if (exemplo == null) {
      return res.status(404).json({ message: 'Exemplo não encontrado' });
    }
    res.json(exemplo);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Rota para criar um exemplo
router.post('/exemplos', async (req, res) => {
  const exemplo = new Exemplo({
    nome: req.body.nome,
    idade: req.body.idade
  });

  try {
    const novoExemplo = await exemplo.save();
    res.status(201).json(novoExemplo);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Rota para atualizar um exemplo
router.patch('/exemplos/:id', async (req, res) => {
  try {
    const exemplo = await Exemplo.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (exemplo == null) {
      return res.status(404).json({ message: 'Exemplo não encontrado' });
    }
    res.json(exemplo);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Rota para excluir um exemplo
router.delete('/exemplos/:id', async (req, res) => {
  try {
    const exemplo = await Exemplo.findByIdAndDelete(req.params.id);
    if (exemplo == null) {
      return res.status(404).json({ message: 'Exemplo não encontrado' });
    }
    res.json({ message: 'Exemplo excluído com sucesso' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

const express = require('express');
const app = express();
const db = require('./db');
const apiRoutes = require('./apiRoutes');

app.use(express.json());
app.use('/api', apiRoutes);

app.listen(3000, () => {
  console.log('Servidor rodando em http://localhost:3000');
});

