const { Book, Code } = require('../../models');
exports.getAll = async (req, res) => {
  try { const items = await Book.findAll({ include: [{ model: Code, as: 'parentCode' }] }); res.json(items); }
  catch (e) { res.status(500).json({ error: e.message }); }
};
exports.getOne = async (req, res) => {
  try {
    const item = await Book.findByPk(req.params.id, { include: [{ model: Code, as: 'parentCode' }] });
    if (!item) return res.status(404).json({ error: 'Non trouvé' });
    res.json(item);
  } catch (e) { res.status(500).json({ error: e.message }); }
};