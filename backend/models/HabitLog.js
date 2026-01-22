module.exports = (sequelize, DataTypes) => {
  const HabitLog = sequelize.define('HabitLog', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    habitId: { type: DataTypes.UUID, allowNull: false },
    completedAt: { type: DataTypes.DATE, allowNull: false },
    status: { type: DataTypes.ENUM('completed', 'missed', 'skipped'), allowNull: false, defaultValue: 'completed'},
    dueDate: { type: DataTypes.DATE, allowNull: false},
    nextDueDate: { type: DataTypes.DATE, allowNull: false } //TODO: Add same column to habit?
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
