const { User, Role } = require('../models');
const { AppError } = require('../utils/responseHandler');
const habitService = require('./habit.service');

exports.findById = async (id) => {
    return User.findByPk(id, {
        include: { model: Role, attributes: ['id', 'name'], },
    });
}

exports.findByEmail = async (email) => {
    return User.findOne({ where: {email}, include: {model: Role}})
}

exports.deleteById = async (id) => {
    const user = await exports.findById(id)
    if(!user) throw new AppError('userNotExist', 400) // TODOIMP: Localize. Problem is i18n is only accessible via req (attached in server.js). i have to pass req or make a localization service.
    return user.destroy()
}

exports.isEmailUsed = async (email) => {
    return await User.findOne({ where: { email } }) !== null
}

exports.updateTimezone = async (userId, newTimezone) => {
    const user = await User.findByPk(userId);
    if (!user) {
        throw new AppError('userNotExist', 400);
    }

    const oldTimezone = user.timezone;
    
    // Update user timezone
    user.timezone = newTimezone;
    await user.save();

    // Update all habits' nextDueDate if timezone changed
    let habitsUpdated = 0;
    if (oldTimezone !== newTimezone) {
        habitsUpdated = await habitService.updateHabitsForTimezoneChange(
            userId,
            oldTimezone,
            newTimezone
        );
    }

    return { user, habitsUpdated };
}