const Joi = require('joi');
const userService = require('../services/user.service')
const tokenService = require('../services/token.service');
const { sendError, sendSuccess } = require('../utils/responseHandler');
// TODO: Unify response messages format
// TODO: Joi arabic localization support? Make custom messages?
const registerSchema = Joi.object({
    email: Joi.string().email().required(),
    username: Joi.string().required(), 
    password: Joi.string().min(1).required() //set up min as 1 for now. quicker.
}).required();

//SO FAR, LOGIN IS VIA EMAIL+PASS ALONE.
const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(1).required()
}).required();

exports.login = async (req, res) => {
    const { error } = loginSchema.validate(req.body);
    if(error) {return sendError(res, 400, error.details[0].message)}

    const emailExists = await userService.isEmailUsed(req.body.email)
    if(!emailExists) {return sendError(res, 401, req.__("wrongLoginCreds"))}
    // try{
        const user = await userService.loginUser(req.body)
        if (user){
            const { accessToken, refreshToken } = tokenService.createTokens(user);
            tokenService.setRtCookie(res, refreshToken);
            return sendSuccess(res, 200, req.__('operationSuccess'), {
                token: accessToken
            })
        }
        // return res.status(401).send(req.__("wrongLoginCreds"))
        return sendError(res, 401, req.__("wrongLoginCreds"))
    // }
    // catch(e){
    //     //TODO: REMOVE TRY/CATCH AND LET GLOBAL ERROR MIDDLEWARE HANDLE IT.
    //     res.status(500).send(e.message)
    // }
}

exports.register = async (req, res) => {
    const { error } = registerSchema.validate(req.body)
    if(error) return sendError(res, 400, error.details[0].message) //TODO: Maybe return a list of errors too?

    const emailAlreadyUsed = await userService.isEmailUsed(req.body.email)
    if (emailAlreadyUsed) return sendError(res, 400, req.__("emailUsed"))

    try{
        const user = await userService.createUser(req.body)
        
        if (user){
            // Should user be returned?
            return sendSuccess(res, 200, undefined, {
                id: user.id,
                email: user.email,
                username: user.username
            })
        }
        else{
            return sendError(res, 400, req.__("registerFail"))
        }
    }
        catch(e){
        console.error(e)
        return res.status(500).send(e.message)
    }
}

exports.logout = async (req, res) => {
    try{
        res.clearCookie("rt", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
        });
        return sendSuccess(res, 200, req.__('operationSuccess'))
    }
    catch(e){
        res.status(500).send(e.message)
    }
}


