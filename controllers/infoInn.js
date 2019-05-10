const ENV = require('../settings/env');
const fetch = require('node-fetch');

const checkInnInfo = (req, res, pg) => {

    pg.select('inn').from('users').where('inn', req.params.inn)
        .then(rows => {
            if (rows.length){
                res.json({
                    userExists: true,
                    inn: rows[0].inn
                })
            } else {
                getInfoByInn(req.params.inn)
                    .then(innInfo => res.json(innInfo))
                    .catch(error =>{
                        console.log('getInfoByInn error: ' + error);
                        res.status(400).json("can't get info by INN");
                    });
            }
        })
        .catch(error => {
            console.log('pg select error: ' + error);
            res.status(500).json("can't verify info by INN")
        });
};

const getInfoByInn = (INN) => {

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
                "query": INN,
                "branch_type": "MAIN"
            })
        })
        .then(resp=>resp.json())
        .then(resp => {
            if (resp.message) throw new Error(resp.message);
            if (resp.suggestions.count = 0) throw new Error('no data');

            dataObject = resp.suggestions[0].data;

            return {
                userExists: false,
                inn: dataObject.inn,
                kpp: dataObject.kpp,
                companyName: dataObject.name.short_with_opf,
                management: dataObject.management.name,
                address: dataObject.address.value,
                phone: dataObject.phones ? dataObject.phones[0] : null,
                email: dataObject.emails ? dataObject.emails[0] : null
            }

        })
   )
};


module.exports = {checkInnInfo};