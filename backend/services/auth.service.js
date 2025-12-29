const bcrypt = require('bcryptjs')
const userService = require('./user.service')
const { User, Role } = require('../models')
exports.createUser = async (data) => {
    const hashed = await bcrypt.hash(data.password, 10)
    const memberRoleId = await Role.findOne({
        where: {name: 'member'}
    })
    return User.create({
        email: data.email,
        username: data.username,
        password: hashed,
        roleId: memberRoleId.id // For now since I have only one admin, all other users are members.
    })
}

exports.loginUser = async (data) => {
    const user = await userService.findByEmail(data.email)
    if(!user) return null
    else if (await bcrypt.compare(data.password, user.password)){
        return user
    }
}

