const { Article, Section, Chapter } = require('../../models');
exports.getAll = async (req, res) => {
  try { const articles = await Article.findAll({ include: ['parentSection', 'parentChapter'] }); res.json(articles); }
  catch (e) { res.status(500).json({ error: e.message }); }
};
exports.getOne = async (req, res) => {
  try {
    const article = await Article.findByPk(req.params.id, { include: ['parentSection', 'parentChapter'] });
    if (!article) return res.status(404).json({ error: 'Article non trouvé' });
    res.json(article);
  } catch (e) { res.status(500).json({ error: e.message }); }
};
exports.getByChapter = async (req, res) => {
  try { const articles = await Article.findAll({ where: { chapterId: req.params.chapterId } }); res.json(articles); }
  catch (e) { res.status(500).json({ error: e.message }); }
};
exports.getBySection = async (req, res) => {
  try { const articles = await Article.findAll({ where: { sectionId: req.params.sectionId } }); res.json(articles); }
  catch (e) { res.status(500).json({ error: e.message }); }
};