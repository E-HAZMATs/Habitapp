const { AppError } = require("../utils/responseHandler");

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    username: { type: DataTypes.STRING, allowNull: false, unique: true }, // CHECK: Username should be unique? cus in the hook i use username to stop deleting admins.
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    roleId: { type: DataTypes.UUID, references: { model: 'Roles', key: "id" }, allowNull: true }, // TODO: Make allow null false when adding member role? user has to have some role.
    isSystemUser: { type: DataTypes.BOOLEAN, defaultValue: false },
    timezone: { type: DataTypes.STRING, allowNull: false, defaultValue: "Asia/Riyadh"}

  }, {
    tableName: 'Users',
    timestamps: true,
    paranoid: true,
    hooks: {
      beforeDestroy: async (user, options) => {
        if (user.username === 'admin' || user.isSystemUser) {
          throw new AppError('cantDeleteSysUsers', 403)
        }
      },
      beforeBulkDestroy: async (options) => {
        const users = await sequelize.models.User.findAll({ where: options.where, paranoid: false });
        for (const user of users) {
          if (user.username === 'admin' || user.isSystemUser) {
            throw new AppError('cantDeleteSysUsers', 403)
          }
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
