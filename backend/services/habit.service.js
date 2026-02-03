const { Habit, HabitLog, User } = require('../models');
const { calculateNextDueDate } = require('../utils/habitHelper')
const { Op } = require('sequelize');

exports.create = async (data) => {
    const date = new Date()
    // Timezone issue. Upon creation, nextduedate is UTC relative to current timezone. if time zone changes then it's inaccurate,
    // Need something to update nextduedates UTC when timezone changes?
    date.setHours(0,0,0,0);
    switch (data.frequencyType){
        case 'daily':
            const [hour, minute, second] = data.timeOfDay ? data.timeOfDay.split(':').map(Number) : [0, 0, 0];
            date.setHours(hour, minute, second);
            data.nextDueDate = date;
            break;

        case 'weekly': 
            const dateDay = date.getDay();
            let daysToAdd = Number(data.dayOfWeek) - dateDay;

            if (daysToAdd < 0)
                daysToAdd += 7
            date.setDate(date.getDate() + daysToAdd)
            data.nextDueDate = date;
            break;

        case 'monthly': 
            if (Number(data.dayOfMonth) < date.getDate())
                date.setMonth(date.getMonth() + 1)

            let lastDayOfMonth = new Date(
                date.getFullYear(),
                date.getMonth() + 1,
                0
            ).getDate();

            const targetDayOfMonth = Math.min(data.dayOfMonth, lastDayOfMonth);
            date.setDate(targetDayOfMonth);
            data.nextDueDate = date;
            break;
    }
    console.log(data);
    return await Habit.create(data);
}

exports.update = async (id, userId, data) => {
    const habit = await Habit.findByPk(id)
    if(!habit)
        return 0
    if(habit.userId !== userId)
        return -1

    return await habit.update({
        name: data.name,
        description: data.description,
        frequencyType: data.frequencyType,
        frequencyAmount: data.frequencyAmount,
        dayOfWeek: data.dayOfWeek,
        dayOfMonth: data.dayOfMonth,
        timeOfDay: data.timeOfDay
    })
}

exports.delete = async (id, userId) => {
    
    const habit = await Habit.findOne({
        where: {id}
    })
    //CHECK: Handle deactivation? maybe soft deletion is enough. unless I add some page to disable habits momentarily.
    if(!habit)
        return 0;

    if(habit.userId !== userId)
        return -1 // Users can only delete their own habits. May implement Admin priv later.
    
    return await Habit.destroy({
        where: {
            id: id,
            userId: userId
        }
    })
}

exports.getAllByUser = async (userId) => {
    const habits = await Habit.findAll({
        where: {userId}
    })
    return habits;
}

exports.getById = async (id) => {
    const habit = await Habit.findByPk(id)
    return habit
}

exports.habitComplete = async (habitId, user, reqBody) => {
    const habit = await Habit.findByPk(habitId);
    if (habit.userId !== user.id) // User can't complete another user's habits.
        return -1
    const nextDueDate = calculateNextDueDate(habit, reqBody.completedAt);
    const result = await HabitLog.create({
        habitId: habitId,
        completedAt: reqBody.completedAt,
        nextDueDate: nextDueDate,
        dueDate: habit.nextDueDate,
        timezone: user.timezone
    });
    habit.nextDueDate = nextDueDate;
    // CHECK: Should have try/catch?
    if (result) {
        habit.nextDueDate = nextDueDate;
        await habit.save();
        return result;
    }
    return -1;
}

exports.getOverdueHabits = async () => {
  const now = new Date();
  now.setHours(0, 0, 0, 0); // CHECK: Will this make it retrieve habits due on Day before now's date?
  const habits = await Habit.findAll({
    where: {
      isActive: true,
      deletedAt: null,
      nextDueDate: {
        [Op.lt]: now 
      }
    },
    include: [{
      model: User,
      attributes: ['timezone']
    }]
  });
  
  return habits;
};

exports.logMissedHabit = async (habit, userTimezone) => {
  const now = new Date();
  const nextDueDate = calculateNextDueDate(habit, habit.nextDueDate); // CHECK: This will return wrong (not necessarily wrong, but the supposed nextduedate which could way before now) nextdue date incase of habits due days ago but not logged as missed. 
  // It's no issue, cus once db is reset no data will have false stuff?
  
  const log = await HabitLog.create({
    habitId: habit.id,
    completedAt: now,
    status: 'missed',
    dueDate: habit.nextDueDate,
    nextDueDate: nextDueDate,
    timezone: userTimezone
  });
  
  habit.nextDueDate = nextDueDate;
  await habit.save();
  
  return log;
};

exports.updateHabitsForTimezoneChange = async (userId, oldTimezone, newTimezone) => {
  try {
    const habits = await Habit.findAll({
      where: {
        userId: userId,
        isActive: true,
      }
    });

    const now = new Date();
    const oldDate = new Date(now.toLocaleString('en-US', { timeZone: oldTimezone }));
    const newDate = new Date(now.toLocaleString('en-US', { timeZone: newTimezone }));
    const offsetDiff = newDate.getTime() - oldDate.getTime();
    
    for (const habit of habits) {
      // if asia/riyadh is utc+3 and then move to shanghai which utc+8 then the nextduedate utc should be subtracted by 5.
      const adjustedNextDue = new Date(habit.nextDueDate.getTime() - offsetDiff);
      
      habit.nextDueDate = adjustedNextDue;
      await habit.save();
    }
    return habits.length;
  } catch (error) {
    throw error;
  }
};