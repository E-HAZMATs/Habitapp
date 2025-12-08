const { Role } = require('../models')

// TODO: IMPLEMENT!!!
exports.getById = async (id) => {
    const role = await Role.findOne({ where: {id}})
    if (role) return role
    return role //TODO: HANDLE ROLE NOT EXIST.  
}