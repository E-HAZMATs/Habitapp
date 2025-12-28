const { Habit } = require('../models')

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
        where: {id: userId}
    })
    console.log(habits)
}