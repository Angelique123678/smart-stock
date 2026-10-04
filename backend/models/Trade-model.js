// models/Trade.js
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Trade extends Model {
    static associate(models) {
        Trade.belongsToMany(models.Material, {
          through: 'MaterialTrades',
          foreignKey: 'trade_id',
          otherKey: 'material_id',
          as: 'materials'
        });
      }
  }
   
  Trade.init({
    trade_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    trade_short_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    trade_long_name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Trade',
    tableName: 'trades',
    timestamps: true
  });
  
  return Trade;
};