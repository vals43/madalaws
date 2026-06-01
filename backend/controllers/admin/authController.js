const jwt = require('jsonwebtoken'); const { User } = require('../../models');
if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET manquant dans .env');
exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Champs requis' });
    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(400).json({ error: 'Email déjà utilisé' });
    const user = await User.create({ email, password });
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ token, user: { id: user.id, email: user.email } });
  } catch (e) { res.status(400).json({ error: e.message }); }
};
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user || !(await user.validatePassword(password))) return res.status(401).json({ error: 'Identifiants invalides' });
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, email: user.email } });
  } catch (e) { res.status(400).json({ error: e.message }); }
};