const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Code = sequelize.define('Code', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT }
}, { tableName: 'codes', timestamps: true });
module.exports = Code;