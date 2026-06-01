const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Chapter = sequelize.define('Chapter', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  titleId: { type: DataTypes.UUID, allowNull: false },
  title: { type: DataTypes.STRING, allowNull: false },
  number: { type: DataTypes.STRING }
}, { tableName: 'chapters', timestamps: true });
module.exports = Chapter;