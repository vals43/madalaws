const { Code, Book } = require('../../models');
exports.getAll = async (req, res) => {
  try { const codes = await Code.findAll({ include: [{ model: Book, as: 'books' }] }); res.json(codes); }
  catch (e) { res.status(500).json({ error: e.message }); }
};
exports.getOne = async (req, res) => {
  try {
    const code = await Code.findByPk(req.params.id, { include: [{ model: Book, as: 'books' }] });
    if (!code) return res.status(404).json({ error: 'Code non trouvé' });
    res.json(code);
  } catch (e) { res.status(500).json({ error: e.message }); }
};