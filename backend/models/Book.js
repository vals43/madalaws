const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Book = sequelize.define('Book', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  codeId: { type: DataTypes.UUID, allowNull: false },
  title: { type: DataTypes.STRING, allowNull: false },
  number: { type: DataTypes.STRING }
}, { tableName: 'books', timestamps: true });
module.exports = Book;