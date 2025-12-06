const bcrypt = require('bcryptjs')
const userService = require('./user.service')
const { User } = require('../models')
exports.createUser = async (data) => {
    const hashed = await bcrypt.hash(data.password, 10)
    return User.create({
        email: data.email,
        username: data.username,
        password: hashed
    })
}

exports.loginUser = async (data) => {
    const user = await userService.findByEmail(data.email)
    if(!user) return null
    else if (await bcrypt.compare(data.password, user.password)){
        return user
    }
}

