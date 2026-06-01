const { Section, Chapter } = require('../../models');
exports.getAll = async (req, res) => {
  try { const items = await Section.findAll({ include: [{ model: Chapter, as: 'parentChapter' }] }); res.json(items); }
  catch (e) { res.status(500).json({ error: e.message }); }
};
exports.getOne = async (req, res) => {
  try {
    const item = await Section.findByPk(req.params.id, { include: [{ model: Chapter, as: 'parentChapter' }] });
    if (!item) return res.status(404).json({ error: 'Non trouvé' });
    res.json(item);
  } catch (e) { res.status(500).json({ error: e.message }); }
};