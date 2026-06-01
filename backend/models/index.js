const sequelize = require('../config/database');
const User = require('./User');
const Code = require('./Code');
const Book = require('./Book');
const Title = require('./Title');
const Chapter = require('./Chapter');
const Section = require('./Section');
const Article = require('./Article');

// Hiérarchie : Code -> Livre -> Titre -> Chapitre -> (Section) -> Article
Code.hasMany(Book, { foreignKey: 'codeId', as: 'books' });
Book.belongsTo(Code, { foreignKey: 'codeId', as: 'parentCode' });

Book.hasMany(Title, { foreignKey: 'bookId', as: 'titles' });
Title.belongsTo(Book, { foreignKey: 'bookId', as: 'parentBook' });

Title.hasMany(Chapter, { foreignKey: 'titleId', as: 'chapters' });
Chapter.belongsTo(Title, { foreignKey: 'titleId', as: 'parentTitle' });

Chapter.hasMany(Section, { foreignKey: 'chapterId', as: 'sections' });
Section.belongsTo(Chapter, { foreignKey: 'chapterId', as: 'parentChapter' });

// Un article peut appartenir à une section OU directement à un chapitre
Section.hasMany(Article, { foreignKey: 'sectionId', as: 'articles' });
Chapter.hasMany(Article, { foreignKey: 'chapterId', as: 'articles' });
Article.belongsTo(Section, { foreignKey: 'sectionId', as: 'parentSection' });
Article.belongsTo(Chapter, { foreignKey: 'chapterId', as: 'parentChapter' });

module.exports = { sequelize, User, Code, Book, Title, Chapter, Section, Article };