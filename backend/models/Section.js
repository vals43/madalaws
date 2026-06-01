const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Section = sequelize.define('Section', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  chapterId: { type: DataTypes.UUID, allowNull: false },
  title: { type: DataTypes.STRING, allowNull: false },
  number: { type: DataTypes.STRING }
}, { tableName: 'sections', timestamps: true });
module.exports = Section;