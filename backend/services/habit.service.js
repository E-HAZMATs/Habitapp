const { Habit, HabitLog } = require('../models')

exports.create = async (data) => {
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