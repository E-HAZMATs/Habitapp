const { User } = require('../models')
const bcrypt = require('bcryptjs')
const { AppError } = require('../utils/responseHandler')

exports.createUser = async (data) => {
    const hashed = await bcrypt.hash(data.password, 10)
    return User.create({
        email: data.email,
        username: data.username,
        password: hashed
    })
}

exports.loginUser = async (data) => {
    const user = await User.findOne({ where: {email : data.email}})
    if(!user) return null
    else if (await bcrypt.compare(data.password, user.password)){
        return user
    }
}

exports.isEmailUsed = async (email) => {
    return await User.findOne({ where: { email } }) !== null
}

exports.findById = (id) => {
    return User.findByPk(id);
}
