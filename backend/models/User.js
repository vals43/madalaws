const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcryptjs');
const User = sequelize.define('User', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.ENUM('admin'), defaultValue: 'admin' }
}, {
  tableName: 'users',
  hooks: {
    beforeCreate: async (u) => { if (u.password) u.password = await bcrypt.hash(u.password, 10); },
    beforeUpdate: async (u) => { if (u.changed('password') && u.password) u.password = await bcrypt.hash(u.password, 10); }
  }
});
User.prototype.validatePassword = async function(pwd) { return await bcrypt.compare(pwd, this.password); };
module.exports = User;