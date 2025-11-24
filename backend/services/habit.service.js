const { Habit } = require('../models')

exports.create = async (data) => {
    return await Habit.create(data);
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