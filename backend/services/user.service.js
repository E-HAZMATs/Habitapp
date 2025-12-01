const { User } = require('../models')

exports.findById = (id) => {
    return User.findByPk(id);
}
