const { User } = require('../models')
const bcrypt = require('bcryptjs')

exports.createUser = async (data) => {
    const hashed = await bcrypt.hash(data.password, 10)
    return User.create({
        email: data.email,
        username: data.username,
        password: hashed
    })
}

exports.isEmailUsed = (email) => {
    return User.findOne({ where: { email } }) !== null
}
