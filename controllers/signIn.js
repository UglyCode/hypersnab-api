const jwt = require('jsonwebtoken');
const redis = require('redis');

//setup Redis!
const redisURI = process.env.REDIS_URL || 'localhost:6379';
const redisClient = redis.createClient(redisURI);

const handleSignIn = (pg, bcrypt, req, res) =>{
    const {inn, password} = req.body;

    if(!inn || !password){
        return Promise.reject('bad request');
    }

    return pg.select('inn', 'hash').from('login')
        .where('inn', '=', inn)
        .then( userData => {
            if (bcrypt.compareSync(password, userData[0].hash)){
                return pg.select('*').from('users').
                where('inn', '=', inn)
                    .then(user => user[0])
                    .catch(err => Promise.reject('oy-oy-oy-oy'))
            } else {
                Promise.reject('wrong inn or password!')
            }
        })
        .catch(err => (
            Promise.reject('wrong credentials')));
};

const getAuthTokenId = (req, res) => {
   const {authorization} = req.headers;
   return redisClient.get(authorization, (err, reply) =>{
        if (err || !reply){
            return res.status(400).json('Permission denied');
        }
        return res.json({id: reply});
    })
};

const signToken = (inn) => {
    const jwtPayload = {inn};
    return jwt.sign(jwtPayload, 'hypersnab', {expiresIn: '2 years'});
};

const setToken = (token, inn) => {
    return Promise.resolve(redisClient.set(token, inn));
};

const createSessions = (user) =>{
    const {inn} = user;
    const token = signToken(inn);
    return setToken(token, inn)
        .then(()=>{
            return {success: 'true', inn: inn, token}
        })
        .catch(err => console.log);
};

const signInAuth = (pg, bcrypt) => (req, res) =>{
    const { authorization } = req.headers;
    return authorization ?
        getAuthTokenId(req, res) :
        handleSignIn(pg, bcrypt, req, res)
            .then(data => {
                return data.inn ?
                    createSessions(data)
                    : Promise.reject(data);
            }).then(session => res.json(session))
            .catch(err => {
                console.log('handleSignIn error: ' + err);
                res.status(400).json('cannot verify your pwd')
            });
};

module.exports = {signInAuth, redisClient};
