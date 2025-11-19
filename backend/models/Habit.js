module.exports = (sequelize, DataTypes) => {
  const Habit = sequelize.define('Habit', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },
    frequencyType: { type: DataTypes.ENUM('daily', 'weekly', 'monthly'), allowNull: false },
    frequencyAmount: { type: DataTypes.INTEGER, defaultValue: 1 },
    dayOfWeek: { type: DataTypes.INTEGER, allowNull: true },
    dayOfMonth: { type: DataTypes.INTEGER, allowNull: true },
    timeOfDay: { type: DataTypes.TIME, allowNull: true }
  }, {
    tableName: 'Habits',
    timestamps: true
  });

  Habit.associate = (models) => {
    Habit.belongsTo(models.User, { foreignKey: 'userId' });
    Habit.hasMany(models.HabitLog, { foreignKey: 'habitId' });
  };

  return Habit;
};
