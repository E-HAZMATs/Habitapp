const Joi = require('joi');
const userService = require('../services/user.service')

const registerSchema = Joi.object({
    email: Joi.string().email().required(),
    username: Joi.string().required(), // 
    password: Joi.string().min(1).required() //set up min as 1 for now. quicker.
});

exports.register = async (req, res) => {
    const { error } = registerSchema.validate(req.body)
    if(error) return res.status(400).send(error.details[0].message); 
    try{
        const user = await userService.createUser(req.body)
        
        if (user){
            console.log("user:", user)
            res.status(200).send({
                id: user.id,
                email: user.email,
                username: user.username
            })
        }
        else{
            res.status(400).send('Registration faild.')
        }
    }
        catch(e){
        console.error(e)
        return res.status(500).send(e.message)
    }
}
