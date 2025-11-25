const jwt = require('jsonwebtoken')

exports.authMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if(!authHeader) return res.status(401).send(req.__("accessDenied"));
    
    const token = authHeader.split(' ')[1] // splitting "Bearer" from the token encoded valueand . 
    if(!token) return res.status(401).send(req.__("accessDenied"))

    try{
        const decodedToken = jwt.verify(token, process.env.JWT_KEY)
        req.user = decodedToken
        next();
    }   
    catch(e){
        return res.status(403).send(req.__("invalidToken"))
    }
}