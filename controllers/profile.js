const handleProfileGet = (req, res, pg) =>{

    return pg.select('*').from('users').
                where('inn', req.params.inn)
                    .then(users => {
                        if (users.length){
                            res.json(users[0])
                        } else {
                            res.status(404).json('Not found')
                        }
                    })
        .catch(err => res.status('400').json("can't get user"));
};


const handleProfileUpdate = (req, res, pg) => {
    const {id} = req.params;
    const {name, age, pet } = req.body.formInput;
    pg('users')
        .where({id})
        .update({name})
        .then(response =>{
            if (response) {
                res.json('all done')
            } else{
                res.status(400).json('smth went wrong')
            }
        })
        .catch(err => res.status(500).json('error appeared while updating'))
};

module.exports = {handleProfileGet, handleProfileUpdate};