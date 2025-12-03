const { User, Role } = require('../models');
const { AppError } = require('../utils/responseHandler');

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