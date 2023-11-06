const jwt = require('jsonwebtoken');


    const verifyToken = (req, res, next) => {
    const token = req.cookies.access_token;

    if(!token) {
        const err = new err('Unauthorized');
        err.statusCode = 401;
        return next(err)
    }
    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
        if(err){
            console.error("JWT VRIFIY ERORRR", err)
            return res.status(403).json("not allowed, coming from verifyUser.js")
        }
        req.user = user;
        next();
    })
}
module.exports = verifyToken;