module.exports = (sequelize, DataTypes) => {
  const HabitLog = sequelize.define('HabitLog', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    habitId: { type: DataTypes.UUID, allowNull: false },
    completedAt: { type: DataTypes.DATE, allowNull: false }
  }, {
    tableName: 'HabitLogs',
    timestamps: true,
    paranoid: true
  });

  HabitLog.associate = (models) => {
    HabitLog.belongsTo(models.Habit, { foreignKey: 'habitId' });
  };

  return HabitLog;
};
