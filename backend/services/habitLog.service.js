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