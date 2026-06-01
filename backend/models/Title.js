const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Title = sequelize.define('Title', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  bookId: { type: DataTypes.UUID, allowNull: false },
  title: { type: DataTypes.STRING, allowNull: false },
  number: { type: DataTypes.STRING }
}, { tableName: 'titles', timestamps: true });
module.exports = Title;