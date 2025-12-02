const { AppError } = require("../utils/responseHandler");

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    username: { type: DataTypes.STRING, allowNull: false, unique: true },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    roleId: { type: DataTypes.UUID, references: { model: 'Roles', key: "id" }, allowNull: true },
    isSystemUser: { type: DataTypes.BOOLEAN, defaultValue: false }

  }, {
    tableName: 'Users',
    timestamps: true,
    paranoid: true,
    hooks: {
      beforeDestroy: async (user, options) => {
        if (user.username === 'admin' || user.isSystemUser){
          throw new AppError("Can't soft delete system users.") // TODO: Localize
        }
      },
    }
  });

  User.associate = (models) => {
    User.hasMany(models.Habit, { foreignKey: 'userId' });
    User.belongsTo(models.Role, {foreignKey: 'roleId'})
  };

  return User;
};
