require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { sequelize } = require('./models');

// Import routes publiques et admin
const publicCodeRoutes = require('./routes/public/codes');
const publicBookRoutes = require('./routes/public/books');
const publicTitleRoutes = require('./routes/public/titles');
const publicChapterRoutes = require('./routes/public/chapters');
const publicSectionRoutes = require('./routes/public/sections');
const publicArticleRoutes = require('./routes/public/articles');
const adminAuthRoutes = require('./routes/admin/auth');
const adminCodeRoutes = require('./routes/admin/codes');
const adminBookRoutes = require('./routes/admin/books');
const adminTitleRoutes = require('./routes/admin/titles');
const adminChapterRoutes = require('./routes/admin/chapters');
const adminSectionRoutes = require('./routes/admin/sections');
const adminArticleRoutes = require('./routes/admin/articles');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

// Routes publiques
app.use('/api/codes', publicCodeRoutes);
app.use('/api/books', publicBookRoutes);
app.use('/api/titles', publicTitleRoutes);
app.use('/api/chapters', publicChapterRoutes);
app.use('/api/sections', publicSectionRoutes);
app.use('/api/articles', publicArticleRoutes);

// Routes admin
app.use('/api/admin/auth', adminAuthRoutes);
app.use('/api/admin/codes', adminCodeRoutes);
app.use('/api/admin/books', adminBookRoutes);
app.use('/api/admin/titles', adminTitleRoutes);
app.use('/api/admin/chapters', adminChapterRoutes);
app.use('/api/admin/sections', adminSectionRoutes);
app.use('/api/admin/articles', adminArticleRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'OK' }));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Erreur interne' });
});

sequelize.authenticate()
  .then(() => {
    console.log('Connecté à PostgreSQL');
    app.listen(PORT, () => console.log(`Serveur sur port ${PORT}`));
  })
  .catch(err => console.error('Erreur BDD:', err));

module.exports = app;