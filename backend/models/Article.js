const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Article = sequelize.define('Article', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  sectionId: { type: DataTypes.UUID, allowNull: true },
  chapterId: { type: DataTypes.UUID, allowNull: true },
  number: { type: DataTypes.STRING, allowNull: false },
  content: { type: DataTypes.TEXT, allowNull: false }
}, { tableName: 'articles', timestamps: true });
module.exports = Article;