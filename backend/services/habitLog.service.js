const { HabitLog, Habit } = require('../models');

exports.getLogsByUser = async (userId, page = 1, size = 10) => {
  const skip = (page - 1) * size;
  
  const { count, rows } = await HabitLog.findAndCountAll({
    include: [{
      model: Habit,
      where: { userId },
      attributes: ['name', 'description', 'frequencyType']
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