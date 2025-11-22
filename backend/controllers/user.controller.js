const Joi = require('joi');
const Jwt = require('jsonwebtoken')
const userService = require('../services/user.service')

const registerSchema = Joi.object({
    email: Joi.string().email().required(),
    username: Joi.string().required(), // 
    password: Joi.string().min(1).required() //set up min as 1 for now. quicker.
});

//SO FAR, LOGIN IS VIA EMAIL+PASS ALONE.
const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(1).required()
})

exports.login = async (req, res) => {
    const { error } = loginSchema.validate(req.body);
    if(error) {return res.status(400).send(error.details[0].message)}

    const emailExists = await userService.isEmailUsed(req.body.email)
    if(!emailExists) {return res.status(401).send(req.__("wrong_login_creds"))}
    try{
        const user = await userService.loginUser(req.body)
        if (user){
            
            const token = Jwt.sign(
                {id: user.id, email: user.email},
                process.env.JWT_KEY,
                { expiresIn: '8h'} //TODO: IMPLEMENT HTTP ONLY COOKIE LONG LIVED TOKEN TO PREVENT XSS?
            );
            return res.status(200).send({
                token
            })
        }
        return res.status(401).send(req.__("wrong_login_creds"))
    }
    catch(e){
        res.status(500).send(e.message)
    }
}
exports.register = async (req, res) => {
    const { error } = registerSchema.validate(req.body)
    if(error) return res.status(400).send(error.details[0].message); 

    const emailAlreadyUsed = await userService.isEmailUsed(req.body.email)
    if (emailAlreadyUsed) return res.status(400).send(req.__("email_used"))

    try{
        const user = await userService.createUser(req.body)
        
        if (user){
            res.status(200).send({
                id: user.id,
                email: user.email,
                username: user.username
            })
        }
        else{
            res.status(400).send(req.__("register_fail"))
        }
    }
        catch(e){
        console.error(e)
        return res.status(500).send(e.message)
    }
}


