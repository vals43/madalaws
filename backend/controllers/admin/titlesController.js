const { Title } = require('../../models');
exports.create = async (req, res) => {
  try { const doc = await Title.create(req.body); res.status(201).json(doc); }
  catch (e) { res.status(400).json({ error: e.message }); }
};
exports.update = async (req, res) => {
  try {
    const doc = await Title.findByPk(req.params.id);
    if (!doc) return res.status(404).json({ error: 'Non trouvé' });
    await doc.update(req.body); res.json(doc);
  } catch (e) { res.status(400).json({ error: e.message }); }
};
exports.delete = async (req, res) => {
  try {
    const doc = await Title.findByPk(req.params.id);
    if (!doc) return res.status(404).json({ error: 'Non trouvé' });
    await doc.destroy(); res.status(204).send();
  } catch (e) { res.status(400).json({ error: e.message }); }
};