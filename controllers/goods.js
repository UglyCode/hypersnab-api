const {Client} = require('pg');
const connectionString = process.env.DATABASE_URL;
const client = new Client({
    connectionString: connectionString,
});
client.connect();

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
    client
        .query('SELECT f.name AS folder, p.name AS parent\n' +
            'FROM folders f\n' +
            'INNER JOIN folders p ON f.parent = p.code')
        .then(res => console.log(res.rows[0]))
        .catch(e => console.error(e.stack))
};

module.exports = {handleGoodsGet, handleFoldersGet, handleFiltersGet};