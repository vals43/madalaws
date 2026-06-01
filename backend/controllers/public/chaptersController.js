const { Chapter, Title } = require('../../models');
exports.getAll = async (req, res) => {
  try { const items = await Chapter.findAll({ include: [{ model: Title, as: 'parentTitle' }] }); res.json(items); }
  catch (e) { res.status(500).json({ error: e.message }); }
};
exports.getOne = async (req, res) => {
  try {
    const item = await Chapter.findByPk(req.params.id, { include: [{ model: Title, as: 'parentTitle' }] });
    if (!item) return res.status(404).json({ error: 'Non trouvé' });
    res.json(item);
  } catch (e) { res.status(500).json({ error: e.message }); }
};