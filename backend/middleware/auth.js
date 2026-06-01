const jwt = require('jsonwebtoken');
const { User } = require('../models');
const authenticateAdmin = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token manquant' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.userId);
    if (!user || user.role !== 'admin') return res.status(403).json({ error: 'Accès admin requis' });
    req.user = user;
    next();
  } catch { res.status(403).json({ error: 'Token invalide' }); }
};
module.exports = { authenticateAdmin };