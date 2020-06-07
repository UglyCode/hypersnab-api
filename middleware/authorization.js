const redisClient = require('../controllers/signIn').redisClient;

const requireAuth = (req, res, next) => {

    const {authorization} = req.headers;
    console.log(authorization);
    if (!authorization){
        return res.status(401).json('Unauthorized');
    }
    return redisClient.get(authorization, (err, reply) =>{
        if (err || !reply){
            return res.status(401).json('Unauthorized');
        }
        return next();
    });

};

const parseInnFromToken = (req, res, next) => {
    const {authorization} = req.headers;
    return redisClient.get(authorization, (err, reply) =>{
        if (!err && reply){
            req.headers.inn = reply;
        } else {
            req.headers.inn = 0;
        }
    });
    return next();
};

module.exports = {requireAuth, parseInnFromToken};