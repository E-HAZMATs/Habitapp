const Joi = require('joi');
const userService = require('../services/user.service')
const tokenService = require('../services/token.service')

const registerSchema = Joi.object({
    email: Joi.string().email().required(),
    username: Joi.string().required(), // 
    password: Joi.string().min(1).required() //set up min as 1 for now. quicker.
}).required();

//SO FAR, LOGIN IS VIA EMAIL+PASS ALONE.
const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(1).required()
}).required();

exports.login = async (req, res) => {
    const { error } = loginSchema.validate(req.body);
    if(error) {return res.status(400).send(error.details[0].message)}

    const emailExists = await userService.isEmailUsed(req.body.email)
    if(!emailExists) {return res.status(401).send(req.__("wrongLoginCreds"))}
    try{
        const user = await userService.loginUser(req.body)
        if (user){
            
            const { accessToken, refreshToken } = tokenService.createTokens(user);
            tokenService.setRtCookie(res, refreshToken);
            return res.status(200).send({
                accessToken
            })
        }
        return res.status(401).send(req.__("wrongLoginCreds"))
    }
    catch(e){
        res.status(500).send(e.message)
    }
}

exports.register = async (req, res) => {
    const { error } = registerSchema.validate(req.body)
    if(error) return res.status(400).send(error.details[0].message); 

    const emailAlreadyUsed = await userService.isEmailUsed(req.body.email)
    if (emailAlreadyUsed) return res.status(400).send(req.__("emailUsed"))

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
            res.status(400).send(req.__("registerFail"))
        }
    }
        catch(e){
        console.error(e)
        return res.status(500).send(e.message)
    }
}


