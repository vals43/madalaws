const { Title, Book } = require('../../models');
exports.getAll = async (req, res) => {
  try { const items = await Title.findAll({ include: [{ model: Book, as: 'parentBook' }] }); res.json(items); }
  catch (e) { res.status(500).json({ error: e.message }); }
};
exports.getOne = async (req, res) => {
  try {
    const item = await Title.findByPk(req.params.id, { include: [{ model: Book, as: 'parentBook' }] });
    if (!item) return res.status(404).json({ error: 'Non trouvé' });
    res.json(item);
  } catch (e) { res.status(500).json({ error: e.message }); }
};