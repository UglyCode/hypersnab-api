const handleRegister = (req, res, pg, bcrypt) => {
    const {inn, kpp, contact, address, email, phone, name, password} = req.body;

    if(!inn || !password){
        return res.status('400').json('bad request');
    }

    const hash = bcrypt.hashSync(password);

    pg.transaction(trx => {
        trx.insert({
            hash: hash,
            inn: inn
        })
            .into('login')
            .returning('inn')
            .then(loginInn => {
                return trx('users')
                    .returning('*')
                    .insert({
                        inn: loginInn[0],
                        kpp: kpp,
                        contact: contact,
                        address: address,
                        email: email,
                        phone: phone,
                        name: name,
                        created: new Date()})
                    .then(userData => res.json(userData[0]))
            })
            .then(trx.commit)
            .catch(trx.rollback)
    })
        .catch(err => {
            console.log(err);
            res.status('400').json('no U')
        });
};

module.exports = {handleRegister};