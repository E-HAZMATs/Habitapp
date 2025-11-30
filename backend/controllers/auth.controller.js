const jwt = require('jsonwebtoken')
const tokenService = require('../services/token.service')
const userService = require('../services/user.service');
const { sendError, sendSuccess } = require('../utils/responseHandler');

exports.refresh = async (req, res) => {
    const RT = req.cookies.rt;
    if(!RT) return sendError(res, 401, req.__('noRefreshToken'))
    try{
        const decodedRT = jwt.verify(RT, process.env.RT_KEY)
        let user = null;
        try{
            user = await userService.findById(decodedRT.id)
            const { accessToken, refreshToken } = tokenService.createTokens(user);
            tokenService.setRtCookie(res, refreshToken)
            // return res.send({accessToken})
            return sendSuccess(res, 200, undefined, {
                token: accessToken
            })
        }
        catch(e){
            //Todo: REMOVE. LET MIDDLEWARE HANDLE?
            res.send.status(400).send(e.message)
        }
    }
    catch(e){
        //Todo: REMOVE. LET MIDDLEWARE HANDLE?
        return res.status(403).send(req.__('invalidRt'))
    }
}