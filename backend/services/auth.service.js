const bcrypt = require('bcryptjs')
const { User, Role } = require('../models')
const userService = require('./user.service')
const { AppError } = require('../utils/responseHandler')

exports.createUser = async (data) => {
    const hashed = await bcrypt.hash(data.password, 10)
    const memberRole = await Role.findOne({
        where: {name: 'member'}
    })
    if (!memberRole) throw new AppError('memberRoleNotFound', 500)
    return User.create({
        email: data.email,
        username: data.username,
        password: hashed,
        roleId: memberRole.id
    })
}

exports.loginUser = async (data) => {
    const user = await userService.findByEmail(data.email)
    if(!user) return null
    else if (await bcrypt.compare(data.password, user.password)){
        return user
    }
}

