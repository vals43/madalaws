const fs = require('fs');
const path = require('path');

// Création des dossiers
const directories = [
  'backend/config',
  'backend/controllers',
  'backend/middleware',
  'backend/models',
  'backend/routes',
  'backend/migrations',
  'backend/seeders'
];
directories.forEach(dir => {
  const dirPath = path.join(__dirname, dir);
  if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
});

// Création des sous-dossiers pour les contrôleurs/routes
['public', 'admin'].forEach(sub => {
  const ctrlPath = path.join(__dirname, `backend/controllers/${sub}`);
  const routePath = path.join(__dirname, `backend/routes/${sub}`);
  if (!fs.existsSync(ctrlPath)) fs.mkdirSync(ctrlPath, { recursive: true });
  if (!fs.existsSync(routePath)) fs.mkdirSync(routePath, { recursive: true });
});

// package.json
const packageJson = {
  name: "madalaws-backend",
  version: "1.0.0",
  description: "Backend pour la plateforme de lois de Madagascar (MadaLaws) - structure hiérarchique avancée",
  main: "app.js",
  scripts: {
    start: "node app.js",
    dev: "nodemon app.js",
    "db:migrate": "npx sequelize-cli db:migrate",
    "db:seed": "npx sequelize-cli db:seed:all"
  },
  dependencies: {
    express: "^4.18.2",
    pg: "^8.11.3",
    sequelize: "^6.35.2",
    bcryptjs: "^2.4.3",
    jsonwebtoken: "^9.0.2",
    cors: "^2.8.5",
    dotenv: "^16.3.1",
    "express-rate-limit": "^7.1.5",
    helmet: "^7.1.0"
  },
  devDependencies: {
    nodemon: "^3.0.1",
    "sequelize-cli": "^6.6.1"
  }
};
fs.writeFileSync('backend/package.json', JSON.stringify(packageJson, null, 2));
console.log('✅ backend/package.json');

// app.js
const appJs = `const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { sequelize } = require('./models');
require('dotenv').config();

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
    app.listen(PORT, () => console.log(\`Serveur sur port \${PORT}\`));
  })
  .catch(err => console.error('Erreur BDD:', err));

module.exports = app;`;
fs.writeFileSync('backend/app.js', appJs);
console.log('✅ backend/app.js');

// config/database.js
const dbConfig = `const { Sequelize } = require('sequelize');
require('dotenv').config();
const sequelize = new Sequelize(
  process.env.DB_NAME || 'madalaws_db',
  process.env.DB_USER || 'postgres',
  process.env.DB_PASSWORD || '',
  { host: process.env.DB_HOST || 'localhost', port: process.env.DB_PORT || 5432, dialect: 'postgres', logging: false }
);
module.exports = sequelize;`;
fs.writeFileSync('backend/config/database.js', dbConfig);
console.log('✅ backend/config/database.js');

// middleware/auth.js
const authMiddleware = `const jwt = require('jsonwebtoken');
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
module.exports = { authenticateAdmin };`;
fs.writeFileSync('backend/middleware/auth.js', authMiddleware);
console.log('✅ backend/middleware/auth.js');

// --- Modèles ---
// User.js
const userModel = `const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcryptjs');
const User = sequelize.define('User', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.ENUM('admin'), defaultValue: 'admin' }
}, { tableName: 'users', hooks: { beforeCreate: async (u) => { if (u.password) u.password = await bcrypt.hash(u.password, 10); } } });
User.prototype.validatePassword = async function(pwd) { return await bcrypt.compare(pwd, this.password); };
module.exports = User;`;
fs.writeFileSync('backend/models/User.js', userModel);

// Code.js
const codeModel = `const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Code = sequelize.define('Code', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT }
}, { tableName: 'codes', timestamps: true });
module.exports = Code;`;
fs.writeFileSync('backend/models/Code.js', codeModel);

// Book.js
const bookModel = `const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Book = sequelize.define('Book', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  title: { type: DataTypes.STRING, allowNull: false },
  number: { type: DataTypes.STRING }
}, { tableName: 'books', timestamps: true });
module.exports = Book;`;
fs.writeFileSync('backend/models/Book.js', bookModel);

// Title.js
const titleModel = `const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Title = sequelize.define('Title', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  title: { type: DataTypes.STRING, allowNull: false },
  number: { type: DataTypes.STRING }
}, { tableName: 'titles', timestamps: true });
module.exports = Title;`;
fs.writeFileSync('backend/models/Title.js', titleModel);

// Chapter.js
const chapterModel = `const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Chapter = sequelize.define('Chapter', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  title: { type: DataTypes.STRING, allowNull: false },
  number: { type: DataTypes.STRING }
}, { tableName: 'chapters', timestamps: true });
module.exports = Chapter;`;
fs.writeFileSync('backend/models/Chapter.js', chapterModel);

// Section.js
const sectionModel = `const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Section = sequelize.define('Section', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  title: { type: DataTypes.STRING, allowNull: false },
  number: { type: DataTypes.STRING }
}, { tableName: 'sections', timestamps: true });
module.exports = Section;`;
fs.writeFileSync('backend/models/Section.js', sectionModel);

// Article.js
const articleModel = `const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Article = sequelize.define('Article', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  number: { type: DataTypes.STRING, allowNull: false },
  content: { type: DataTypes.TEXT, allowNull: false }
}, { tableName: 'articles', timestamps: true });
module.exports = Article;`;
fs.writeFileSync('backend/models/Article.js', articleModel);

// models/index.js (associations hiérarchiques)
const modelsIndex = `const sequelize = require('../config/database');
const User = require('./User');
const Code = require('./Code');
const Book = require('./Book');
const Title = require('./Title');
const Chapter = require('./Chapter');
const Section = require('./Section');
const Article = require('./Article');

// Hiérarchie : Code -> Livre -> Titre -> Chapitre -> (Section) -> Article
Code.hasMany(Book, { foreignKey: 'codeId', as: 'books' });
Book.belongsTo(Code, { foreignKey: 'codeId', as: 'code' });

Book.hasMany(Title, { foreignKey: 'bookId', as: 'titles' });
Title.belongsTo(Book, { foreignKey: 'bookId', as: 'book' });

Title.hasMany(Chapter, { foreignKey: 'titleId', as: 'chapters' });
Chapter.belongsTo(Title, { foreignKey: 'titleId', as: 'title' });

Chapter.hasMany(Section, { foreignKey: 'chapterId', as: 'sections' });
Section.belongsTo(Chapter, { foreignKey: 'chapterId', as: 'chapter' });

// Un article peut appartenir à une section OU directement à un chapitre
Section.hasMany(Article, { foreignKey: 'sectionId', as: 'articles' });
Chapter.hasMany(Article, { foreignKey: 'chapterId', as: 'articles' });
Article.belongsTo(Section, { foreignKey: 'sectionId', as: 'section' });
Article.belongsTo(Chapter, { foreignKey: 'chapterId', as: 'chapter' });

module.exports = { sequelize, User, Code, Book, Title, Chapter, Section, Article };`;
fs.writeFileSync('backend/models/index.js', modelsIndex);
console.log('✅ Tous les modèles créés');

// --- Contrôleurs publics (exemples complets pour un niveau, les autres sont similaires) ---
const pubCodesController = `const { Code, Book } = require('../../models');
exports.getAll = async (req, res) => {
  const codes = await Code.findAll({ include: [{ model: Book, as: 'books' }] });
  res.json(codes);
};
exports.getOne = async (req, res) => {
  const code = await Code.findByPk(req.params.id, { include: [{ model: Book, as: 'books' }] });
  if (!code) return res.status(404).json({ error: 'Code non trouvé' });
  res.json(code);
};`;
fs.writeFileSync('backend/controllers/public/codesController.js', pubCodesController);

// Répétez pour books, titles, chapters, sections, articles (fichiers courts)
const genericController = (name, parentField, childField) => `const { ${name}, ${parentField.charAt(0).toUpperCase() + parentField.slice(1)} } = require('../../models');
exports.getAll = async (req, res) => {
  const items = await ${name}.findAll({ include: [{ model: ${parentField.charAt(0).toUpperCase() + parentField.slice(1)}, as: '${parentField}' }] });
  res.json(items);
};
exports.getOne = async (req, res) => {
  const item = await ${name}.findByPk(req.params.id, { include: [{ model: ${parentField.charAt(0).toUpperCase() + parentField.slice(1)}, as: '${parentField}' }] });
  if (!item) return res.status(404).json({ error: 'Non trouvé' });
  res.json(item);
};`;
fs.writeFileSync('backend/controllers/public/booksController.js', genericController('Book', 'code', 'books'));
fs.writeFileSync('backend/controllers/public/titlesController.js', genericController('Title', 'book', 'titles'));
fs.writeFileSync('backend/controllers/public/chaptersController.js', genericController('Chapter', 'title', 'chapters'));
fs.writeFileSync('backend/controllers/public/sectionsController.js', genericController('Section', 'chapter', 'sections'));
fs.writeFileSync('backend/controllers/public/articlesController.js', `const { Article, Section, Chapter } = require('../../models');
exports.getAll = async (req, res) => {
  const articles = await Article.findAll({ include: ['section', 'chapter'] });
  res.json(articles);
};
exports.getOne = async (req, res) => {
  const article = await Article.findByPk(req.params.id, { include: ['section', 'chapter'] });
  if (!article) return res.status(404).json({ error: 'Article non trouvé' });
  res.json(article);
};
// Récupération des articles par hiérarchie parente (ex: /api/articles/by-chapter/:chapterId)
exports.getByChapter = async (req, res) => {
  const articles = await Article.findAll({ where: { chapterId: req.params.chapterId } });
  res.json(articles);
};
exports.getBySection = async (req, res) => {
  const articles = await Article.findAll({ where: { sectionId: req.params.sectionId } });
  res.json(articles);
};`);
console.log('✅ Contrôleurs publics créés');

// --- Routes publiques ---
const createRoute = (file, resource) => `const express = require('express'); const router = express.Router(); const ctrl = require('../../controllers/public/${resource}Controller'); router.get('/', ctrl.getAll); router.get('/:id', ctrl.getOne); module.exports = router;`;
fs.writeFileSync('backend/routes/public/codes.js', createRoute('codes', 'codes'));
fs.writeFileSync('backend/routes/public/books.js', createRoute('books', 'books'));
fs.writeFileSync('backend/routes/public/titles.js', createRoute('titles', 'titles'));
fs.writeFileSync('backend/routes/public/chapters.js', createRoute('chapters', 'chapters'));
fs.writeFileSync('backend/routes/public/sections.js', createRoute('sections', 'sections'));
fs.writeFileSync('backend/routes/public/articles.js', `const express = require('express'); const router = express.Router(); const ctrl = require('../../controllers/public/articlesController'); router.get('/', ctrl.getAll); router.get('/:id', ctrl.getOne); router.get('/by-chapter/:chapterId', ctrl.getByChapter); router.get('/by-section/:sectionId', ctrl.getBySection); module.exports = router;`);
console.log('✅ Routes publiques');

// --- Contrôleurs admin (CRUD complet) ---
const adminCodesController = `const { Code } = require('../../models');
exports.create = async (req, res) => { const c = await Code.create(req.body); res.status(201).json(c); };
exports.update = async (req, res) => { const c = await Code.findByPk(req.params.id); if (!c) return res.status(404).json({ error: 'Non trouvé' }); await c.update(req.body); res.json(c); };
exports.delete = async (req, res) => { const c = await Code.findByPk(req.params.id); if (!c) return res.status(404).json({ error: 'Non trouvé' }); await c.destroy(); res.status(204).send(); };`;
fs.writeFileSync('backend/controllers/admin/codesController.js', adminCodesController);
// Idem pour les autres niveaux (pattern identique)
const makeAdminController = (modelName) => `const { ${modelName} } = require('../../models');
exports.create = async (req, res) => { const doc = await ${modelName}.create(req.body); res.status(201).json(doc); };
exports.update = async (req, res) => { const doc = await ${modelName}.findByPk(req.params.id); if (!doc) return res.status(404).json({ error: 'Non trouvé' }); await doc.update(req.body); res.json(doc); };
exports.delete = async (req, res) => { const doc = await ${modelName}.findByPk(req.params.id); if (!doc) return res.status(404).json({ error: 'Non trouvé' }); await doc.destroy(); res.status(204).send(); };`;
fs.writeFileSync('backend/controllers/admin/booksController.js', makeAdminController('Book'));
fs.writeFileSync('backend/controllers/admin/titlesController.js', makeAdminController('Title'));
fs.writeFileSync('backend/controllers/admin/chaptersController.js', makeAdminController('Chapter'));
fs.writeFileSync('backend/controllers/admin/sectionsController.js', makeAdminController('Section'));
fs.writeFileSync('backend/controllers/admin/articlesController.js', makeAdminController('Article'));

// Routes admin (protégées)
const adminRouteCreator = (resource) => `const express = require('express'); const { authenticateAdmin } = require('../../middleware/auth'); const ctrl = require('../../controllers/admin/${resource}Controller'); const router = express.Router(); router.use(authenticateAdmin); router.post('/', ctrl.create); router.put('/:id', ctrl.update); router.delete('/:id', ctrl.delete); module.exports = router;`;
fs.writeFileSync('backend/routes/admin/codes.js', adminRouteCreator('codes'));
fs.writeFileSync('backend/routes/admin/books.js', adminRouteCreator('books'));
fs.writeFileSync('backend/routes/admin/titles.js', adminRouteCreator('titles'));
fs.writeFileSync('backend/routes/admin/chapters.js', adminRouteCreator('chapters'));
fs.writeFileSync('backend/routes/admin/sections.js', adminRouteCreator('sections'));
fs.writeFileSync('backend/routes/admin/articles.js', adminRouteCreator('articles'));

// Authentification admin
const adminAuth = `const jwt = require('jsonwebtoken'); const { User } = require('../../models');
exports.register = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Champs requis' });
  const existing = await User.findOne({ where: { email } });
  if (existing) return res.status(400).json({ error: 'Email déjà utilisé' });
  const user = await User.create({ email, password });
  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.status(201).json({ token, user: { id: user.id, email: user.email } });
};
exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email } });
  if (!user || !(await user.validatePassword(password))) return res.status(401).json({ error: 'Identifiants invalides' });
  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, user: { id: user.id, email: user.email } });
};`;
fs.writeFileSync('backend/controllers/admin/authController.js', adminAuth);
fs.writeFileSync('backend/routes/admin/auth.js', `const express = require('express'); const { register, login } = require('../../controllers/admin/authController'); const router = express.Router(); router.post('/register', register); router.post('/login', login); module.exports = router;`);
console.log('✅ Routes admin et authentification');

// --- Migrations (tables) ---
const migrations = [
  { name: '1-create-user.js', content: `'use strict'; module.exports = { up: async (qi, Sequelize) => { await qi.createTable('users', { id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true }, email: { type: Sequelize.STRING, allowNull: false, unique: true }, password: { type: Sequelize.STRING, allowNull: false }, role: { type: Sequelize.ENUM('admin'), defaultValue: 'admin' }, createdAt: { type: Sequelize.DATE }, updatedAt: { type: Sequelize.DATE } }); }, down: async (qi) => { await qi.dropTable('users'); } };` },
  { name: '2-create-codes.js', content: `'use strict'; module.exports = { up: async (qi, Sequelize) => { await qi.createTable('codes', { id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true }, name: { type: Sequelize.STRING, allowNull: false }, description: { type: Sequelize.TEXT }, createdAt: Sequelize.DATE, updatedAt: Sequelize.DATE }); }, down: async (qi) => { await qi.dropTable('codes'); } };` },
  { name: '3-create-books.js', content: `'use strict'; module.exports = { up: async (qi, Sequelize) => { await qi.createTable('books', { id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true }, title: { type: Sequelize.STRING, allowNull: false }, number: { type: Sequelize.STRING }, codeId: { type: Sequelize.UUID, references: { model: 'codes', key: 'id' }, onDelete: 'CASCADE' }, createdAt: Sequelize.DATE, updatedAt: Sequelize.DATE }); }, down: async (qi) => { await qi.dropTable('books'); } };` },
  { name: '4-create-titles.js', content: `'use strict'; module.exports = { up: async (qi, Sequelize) => { await qi.createTable('titles', { id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true }, title: { type: Sequelize.STRING, allowNull: false }, number: { type: Sequelize.STRING }, bookId: { type: Sequelize.UUID, references: { model: 'books', key: 'id' }, onDelete: 'CASCADE' }, createdAt: Sequelize.DATE, updatedAt: Sequelize.DATE }); }, down: async (qi) => { await qi.dropTable('titles'); } };` },
  { name: '5-create-chapters.js', content: `'use strict'; module.exports = { up: async (qi, Sequelize) => { await qi.createTable('chapters', { id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true }, title: { type: Sequelize.STRING, allowNull: false }, number: { type: Sequelize.STRING }, titleId: { type: Sequelize.UUID, references: { model: 'titles', key: 'id' }, onDelete: 'CASCADE' }, createdAt: Sequelize.DATE, updatedAt: Sequelize.DATE }); }, down: async (qi) => { await qi.dropTable('chapters'); } };` },
  { name: '6-create-sections.js', content: `'use strict'; module.exports = { up: async (qi, Sequelize) => { await qi.createTable('sections', { id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true }, title: { type: Sequelize.STRING, allowNull: false }, number: { type: Sequelize.STRING }, chapterId: { type: Sequelize.UUID, references: { model: 'chapters', key: 'id' }, onDelete: 'CASCADE' }, createdAt: Sequelize.DATE, updatedAt: Sequelize.DATE }); }, down: async (qi) => { await qi.dropTable('sections'); } };` },
  { name: '7-create-articles.js', content: `'use strict'; module.exports = { up: async (qi, Sequelize) => { await qi.createTable('articles', { id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true }, number: { type: Sequelize.STRING, allowNull: false }, content: { type: Sequelize.TEXT, allowNull: false }, sectionId: { type: Sequelize.UUID, references: { model: 'sections', key: 'id' }, onDelete: 'CASCADE' }, chapterId: { type: Sequelize.UUID, references: { model: 'chapters', key: 'id' }, onDelete: 'CASCADE' }, createdAt: Sequelize.DATE, updatedAt: Sequelize.DATE }); }, down: async (qi) => { await qi.dropTable('articles'); } };` }
];
migrations.forEach(m => fs.writeFileSync(`backend/migrations/${m.name}`, m.content));
console.log('✅ Migrations créées');

// Seeders (admin par défaut + exemples)
const seedUsers = `'use strict'; const bcrypt = require('bcryptjs');
module.exports = { up: async (qi) => { const hash = await bcrypt.hash('admin123', 10); await qi.bulkInsert('users', [{ id: '11111111-1111-1111-1111-111111111111', email: 'admin@madalaws.mg', password: hash, role: 'admin', createdAt: new Date(), updatedAt: new Date() }]); }, down: async (qi) => { await qi.bulkDelete('users', null); } };`;
fs.writeFileSync('backend/seeders/1-admin-user.js', seedUsers);
const seedCodes = `'use strict'; module.exports = { up: async (qi) => { await qi.bulkInsert('codes', [{ id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', name: 'Code pénal', description: 'Lois répressives malgaches', createdAt: new Date(), updatedAt: new Date() }]); }, down: async (qi) => { await qi.bulkDelete('codes', null); } };`;
fs.writeFileSync('backend/seeders/2-demo-codes.js', seedCodes);
console.log('✅ Seeders');

// --- Fichiers d'environnement et README ---
fs.writeFileSync('backend/.env.example', `NODE_ENV=development\nPORT=5000\nDB_HOST=localhost\nDB_PORT=5432\nDB_NAME=madalaws_db\nDB_USER=postgres\nDB_PASSWORD=postgres\nJWT_SECRET=supersecretkey`);
fs.writeFileSync('backend/.gitignore', `node_modules/\n.env\n.DS_Store\n*.log`);
const readme = `# MadaLaws Backend\n\n## Installation\n1. \`cd backend\`\n2. \`npm install\`\n3. Créer la base : \`createdb madalaws_db\`\n4. Copier \`.env.example\` → \`.env\` et ajuster\n5. \`npm run db:migrate\`\n6. \`npm run db:seed\`\n7. \`npm run dev\`\n\n## Compte admin par défaut\n- Email : admin@madalaws.mg\n- Mot de passe : admin123\n\n## API\n- Routes publiques : \`/api/codes\`, \`/api/books\`, \`/api/titles\`, \`/api/chapters\`, \`/api/sections\`, \`/api/articles\`\n- Routes admin : \`/api/admin/...\` (JWT requis)`;
fs.writeFileSync('backend/README.md', readme);
console.log('✅ Fichiers complémentaires (env, gitignore, README)');

console.log('\n🎉 Backend MadaLaws généré avec succès !');
console.log('Prochaines étapes :\n   cd backend\n   npm install\n   createdb madalaws_db\n   npm run db:migrate && npm run db:seed\n   npm run dev');