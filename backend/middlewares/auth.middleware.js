const Jwt = require('jsonwebtoken')

exports.authMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    console.log('asdasd')
    if(!authHeader) return res.status(401).send(req.__("access_denied"));
    
    const token = authHeader.split(' ')[1] // splitting "Bearer" from the token encoded valueand . 
    if(!token) return res.status(401).send(req.__("access_denied"))

    try{
        const decodedToken = Jwt.verify(token, process.env.JWT_KEY)
        req.user = decodedToken
        next();
    }   
    catch(e){
        return res.status(403).send(req.__("invalid_token"))
    }
}