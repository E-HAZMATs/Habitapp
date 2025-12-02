module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define('Role', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false, unique: true}
  }, {
    tableName: 'Roles',
    timestamps: true,
    paranoid: true
  });
  
  Role.associate = (models) => {
    Role.hasMany(models.User, { foreignKey: 'roleId' });
  };
  return Role;
};
