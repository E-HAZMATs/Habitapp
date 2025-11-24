const { Habit } = require('../models')

exports.create = async (data) => {
    return await Habit.create(data);
}