const handleRegister = (req, res, pg, bcrypt) => {
    const {email, name, password} = req.body;

    if(!name || !email || !password){
        return res.status('400').json('bad request');
    }

    const hash = bcrypt.hashSync(password);

    pg.transaction(trx => {
        trx.insert({
            hash: hash,
            email: email
        })
            .into('login')
            .returning('email')
            .then(loginEmail => {
                return trx('users')
                    .returning('*')
                    .insert({
                        email: loginEmail[0],
                        name: name,
                        joined: new Date()})
                    .then(userData => res.json(userData[0]))
            })
            .then(trx.commit)
            .catch(trx.rollback)
    })
        .catch(err => res.status('400').json('no U'));
};

module.exports = {handleRegister};