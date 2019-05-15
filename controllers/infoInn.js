const ENV = require('../settings/env');
const fetch = require('node-fetch');

const checkInnInfo = (req, res, pg) => {

    userExists(req.params.inn, pg)
        .then(result => {
            res.json({
                userExists: result,
                inn: result ? req.params.inn : 0
            })
        })
        .catch(error => {
            console.log('pg select error: ' + error);
            res.status(500).json("can't verify info by INN")
        });
};

const userExists = (inn, pg) =>{

    return (
        pg.select('inn').from('users').where('inn', inn)
        .then(rows => {
            return !!rows.length;
        })
    )
};

const getInfoByInn = (req, res, pg) => {

    const inn = req.params.inn;

    userExists(inn, pg)
        .then(result => {
            if (result) {
                return getUserData(inn, pg)
            } else {
                return fetchInnData(inn)
            }
        })
        .then(innInfo => res.json(innInfo))
        .catch(error =>{
            console.log('getInfoByInn error: ' + error);
            res.status(400).json("can't get info by INN");
        });
};

const fetchInnData = (inn) => {

   return (
       fetch('https://suggestions.dadata.ru/suggestions/api/4_1/rs/findById/party',
        {
            method: 'POST',
            headers:{
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": "Token " + ENV.dadataToken
            },
            body: JSON.stringify({
                "query": inn,
                "branch_type": "MAIN"
            })
        })
        .then(resp=>resp.json())
        .then(resp => {
            if (resp.message) throw new Error(resp.message);
            if (resp.suggestions.count == 0) throw new Error('no data');

            dataObject = resp.suggestions[0].data;

            return {
                userExists: false,
                inn: dataObject.inn,
                kpp: dataObject.kpp,
                name: dataObject.name.short_with_opf,
                contact: dataObject.management.name,
                address: dataObject.address.value,
                phone: dataObject.phones ? dataObject.phones[0] : null,
                email: dataObject.emails ? dataObject.emails[0] : null
            }

        })
   )
};

const getUserData = (inn, pg) => {
    return (
        pg.select('*').from('users').where('inn', inn)
            .then(rows => {
                if (rows.length) {
                   return (Object.assign(Object.assign(rows[0]), {userExists: true}))
                }
            })
    )
};

module.exports = {checkInnInfo, getInfoByInn};