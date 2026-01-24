const { Habit, HabitLog } = require('../models');

exports.create = async (data) => {
    const date = new Date()
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

// TODO: When completing a habit, calcute when is nextDue.
exports.habitComplete = async (habitId, userId, reqBody) => {
    const habit = await Habit.findByPk(habitId);
    if (habit.userId !== userId) // User can't complete another user's habits.
        return -1
    const result = await HabitLog.create({
        habitId: habitId,
        completedAt: reqBody.completedAt
    });
    // CHECK: Should have try/catch?
    if (result) {
        habit.lastCompleted = reqBody.completedAt;
        await habit.save();
        return result;
    }
    return -1;
}