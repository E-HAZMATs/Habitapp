const jwt = require('jsonwebtoken')
const tokenService = require('../services/token.service')
const userService = require('../services/user.service');

exports.refresh = async (req, res) => {
    const RT = req.cookies.rt;
    if(!RT) return res.status(401).send(req.__('no-refresh-token'));
    try{
        const decodedRT = jwt.verify(RT, process.env.RT_KEY)
        console.log(decodedRT)
        let user = null;
        try{
            user = await userService.findById(decodedRT.id)
            const { accessToken, refreshToken } = tokenService.createTokens(user);
            tokenService.setRtCookie(res, refreshToken)
            return res.send({accessToken})
        }
        catch(e){
            res.send.status(400).send(e.message)
        }
    }
    catch(e){
        return res.status(403).send(req.__('invalid_rt'))
    }
}