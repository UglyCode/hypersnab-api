const jwt = require('jsonwebtoken');
const redis = require('redis');

//setup Redis!
const redisURI = process.env.REDIS_URL || 'localhost:6379';
const redisClient = redis.createClient(redisURI);

const handleSignIn = (pg, bcrypt, req, res) =>{
    const {email, password} = req.body;

    if(!email || !password){
        return Promise.reject('bad request');
    }

    return pg.select('email', 'hash').from('login')
        .where('email', '=', email)
        .then( userData => {
            if (bcrypt.compareSync(password, userData[0].hash)){
                return pg.select('*').from('users').
                where('email', '=', email)
                    .then(user => user[0])
                    .catch(err => Promise.reject('oy-oy-oy-oy'))
            } else {
                Promise.reject('wrong email or password!')
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

const signToken = (email) => {
    const jwtPayload = {email};
    return jwt.sign(jwtPayload, 'SENIOR', {expiresIn: '2 days'});
};

const setToken = (token, id) => {
    return Promise.resolve(redisClient.set(token, id));
};

const createSessions = (user) =>{
    const {id, email} = user;
    const token = signToken(email);
    return setToken(token, id)
        .then(()=>{
            return {success: 'true', userId: id, token}
        })
        .catch(err => console.log);
};

const signInAuth = (pg, bcrypt) => (req, res) =>{
    const { authorization } = req.headers;
    return authorization ?
        getAuthTokenId(req, res) :
        handleSignIn(pg, bcrypt, req, res)
            .then(data => {
                return data.id && data.email ?
                    createSessions(data)
                    : Promise.reject(data);
            }).then(session => res.json(session))
            .catch(err => res.status(400).json(err));
};

module.exports = {signInAuth, redisClient};
