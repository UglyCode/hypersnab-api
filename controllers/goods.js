const handleGoodsGet = (req, res, pg) =>{

    // return pg.select('*').from('users').
    //             where('inn', req.params.inn)
    //                 .then(users => {
    //                     if (users.length){
    //                         res.json(users[0])
    //                     } else {
    //                         res.status(404).json('Not found')
    //                     }
    //                 })
    //     .catch(err => res.status('400').json("can't get user"));

};

const handleFoldersGet = (req, res, pg) => {
    // const {inn} = req.params;
    // const {name, kpp, contact, address, phone, email} = req.body.formInput;
    // pg('users')
    //     .where({inn})
    //     .update({name, inn, kpp, contact, address, phone, email})
    //     .then(response =>{
    //         if (response) {
    //             res.json('all done')
    //         } else{
    //             res.status(400).json('smth went wrong')
    //         }
    //     })
    //     .catch(err => res.status(500).json('error appeared while updating'))
};

const handleFiltersGet = (req, res, pg) => {

    // return [{filter:'name'}, values:['val1','val2',...]},...]
};

module.exports = {handleGoodsGet, handleFoldersGet};