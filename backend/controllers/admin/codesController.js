const { Code } = require('../../models');
exports.create = async (req, res) => {
  try { const c = await Code.create(req.body); res.status(201).json(c); }
  catch (e) { res.status(400).json({ error: e.message }); }
};
exports.update = async (req, res) => {
  try {
    const c = await Code.findByPk(req.params.id);
    if (!c) return res.status(404).json({ error: 'Non trouvé' });
    await c.update(req.body); res.json(c);
  } catch (e) { res.status(400).json({ error: e.message }); }
};
exports.delete = async (req, res) => {
  try {
    const c = await Code.findByPk(req.params.id);
    if (!c) return res.status(404).json({ error: 'Non trouvé' });
    await c.destroy(); res.status(204).send();
  } catch (e) { res.status(400).json({ error: e.message }); }
};