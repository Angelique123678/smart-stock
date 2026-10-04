// models/Material.js
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Material extends Model {
    static associate(models) {
      // Define associations
      Material.hasMany(models.Request, {
        foreignKey: 'material_id',
        as: 'requests'
      });

      // Define many-to-many association with Trade
      Material.belongsToMany(models.Trade, {
        through: 'MaterialTrades', // This creates a junction table behind the scenes
        foreignKey: 'material_id',
        otherKey: 'trade_id',
        as: 'trades'
      });
    }
  }
  
  Material.init({
    material_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true
    },  
    category: {
      type: DataTypes.ENUM('Non-Consumable', 'Equipment', 'Consumable'),
      allowNull: false
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0
      }
    },
    isAvailable: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    default_message:{
      type: DataTypes.STRING,
      allowNull: false
    }
    // Removed trade_categories field as it's no longer needed
  }, {
    sequelize,
    modelName: 'Material',
    tableName: 'materials',
    timestamps: true
  });
  
  return Material;
};
