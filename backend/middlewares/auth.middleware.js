const jwt = require('jsonwebtoken');
const { sendError } = require('../utils/responseHandler');

exports.authMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if(!authHeader) return sendError(res, 401, req.__('accessDenied'))
    const token = authHeader.split(' ')[1] // splitting "Bearer" from the token encoded valueand . 
    if(!token) return sendError(res, 401, req.__("accessDenied"))
    
    try{
        const decodedToken = jwt.verify(token, process.env.JWT_KEY)
        console.log('Decoded token:', decodedToken)
        req.user = decodedToken
        next();
    }   
    catch(e){
        return sendError(res, 401, req.__('invalidToken'))
    }
}