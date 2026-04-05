const { HabitLog, Habit } = require('../models');
const { AppError } = require('../utils/responseHandler');

exports.getLogsByUser = async (userId, page = 1, size = 10) => {
  const skip = (page - 1) * size;
  
  const { count, rows } = await HabitLog.findAndCountAll({
    include: [{
      model: Habit,
      where: { userId },
      attributes: ['name', 'description', 'frequencyType'],
      paranoid: false
    }],
    order: [['completedAt', 'DESC']],
    limit: size,
    offset: skip
  });

  const totalPages = Math.ceil(count / size);

  return {
    logs: rows,
    pagination: {
      currentPage: page,
      pageSize: size,
      totalItems: count,
      totalPages: totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1
    }
  };
};

exports.getStatsByUser = async (userId) => {

  const logs = await HabitLog.findAll({
    include: [{
      model: Habit,
      where: { userId },
      attributes: ['id', 'name'],
      paranoid: false,
    }],
    order: [['dueDate', 'DESC']],
    paranoid: false,
  });

  // Storing each logs in their corrosponding habit.
  const byHabit = {};
  for (const log of logs) {
    const hid = log.habitId;
    if (!byHabit[hid]) byHabit[hid] = { name: log.Habit.name, logs: [] };
    byHabit[hid].logs.push(log);
  }

  const stats = {};
  for (const [habitId, { name, logs: habitLogs }] of Object.entries(byHabit)) {
    let streak = 0;
    for (const log of habitLogs) {
      if (log.status === 'missed') break;
      streak++;
    }

    const completed = habitLogs.filter(l => l.status === 'completed').length;
    const missed = habitLogs.filter(l => l.status === 'missed').length;
    const total = completed + missed;
    const completionRate = total === 0 ? null : Math.round((completed / total) * 100);

    stats[habitId] = { habitId, name, streak, completionRate };
  }

  return stats;
};

exports.markAsSkipped = async (logId, userId) => {
  const log = await HabitLog.findByPk(logId, {
    include: [{ model: Habit, attributes: ['userId'], paranoid: false }]
  });

  if (!log) throw new AppError('logNotFound', 404);
  if (log.Habit.userId !== userId) throw new AppError('notAuthorized', 403);
  if (log.status !== 'missed') throw new AppError('logNotMissed', 400);

  log.status = 'skipped';
  await log.save();
  return log;
};