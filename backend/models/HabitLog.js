module.exports = (sequelize, DataTypes) => {
  const HabitLog = sequelize.define('HabitLog', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    habitId: { type: DataTypes.INTEGER, allowNull: false },
    completedAt: { type: DataTypes.DATE, allowNull: false }
  }, {
    tableName: 'HabitLogs',
    timestamps: true
  });

  HabitLog.associate = (models) => {
    HabitLog.belongsTo(models.Habit, { foreignKey: 'habitId' });
  };

  return HabitLog;
};
