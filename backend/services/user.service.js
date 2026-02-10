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

exports.me = async (userId) => {
    const user = await User.findByPk(userId, {
        attributes: {exclude: ['password']},
        // include role?
    })

    return user;
}

exports.updateProfile = async (userId, updateData) => {
    const user = await User.findByPk(userId);
    let prevTimezone = user.timezone;
    const updates = {};
    if (updateData.email) updates.email = updateData.email;
    if (updateData.timezone) updates.timezone = updateData.timezone;

    await user.update(updates);

    let habitsUpdatedAmount = 0;
    if (updateData.timezone) 
        habitsUpdatedAmount = habitService.updateHabitsForTimezoneChange(userId, prevTimezone, updateData.timezone)
 
    return {
        user: {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.roleId,
            timezone: user.timezone,
            isSystemUser: user.isSystemUser,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        },
        habitsUpdatedAmount
    };
};