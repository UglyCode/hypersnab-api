console.log('connecting orders .... testing heroku-20');
const { Client } = require('pg');
const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    },
    connectionTimeoutMillis: 20000,
    statement_timeout: 20000
});

client.connect()
    .then(() => console.log(' @@@@@ connected'))
    .catch(err => console.error(' @@@@ error connecting', err.stack));

client.on('error', err => {
    console.error(' @@@ something bad has happened!', err.stack)
});

console.log('waiting for connect');

const handleOrdersGet = (req, res) => {

    const statusFilter = req.query.status;
    const clientFilter = req.query.client;

    let filterText = '';

    if (statusFilter && clientFilter){
        filterText = `where ord.status = ${statusFilter} 
        and ord.client = ${clientFilter} \n`;
    } else if (statusFilter){
        filterText = `where ord.status = '${statusFilter}' \n`;
    } else if (clientFilter){
        filterText = `where ord.client = ${clientFilter} \n`;
    };

    client
        .query('SELECT ord.id as orderId, ord.updated, ord.client, ord.status, ord.delivery, ord.delivery_address, ord.delivery_date, ' +
            'ogd.good, ogd.amount, round(cast(ogd.price as numeric),2) as price, ogd.measure, \n' +
            '\togd.description, round(cast(ogd.amount as numeric), 2)*round(cast(ogd.price as numeric), 2) as sum, ord.comm as comment\n' +
            'FROM public.orders as ord \n' +
            'inner join (\n' +
            '\tselect ordered."order", ordered.good, ordered.amount, ordered.price, goods.description, goods.measure\n' +
            '\tfrom public.ordered_goods as ordered\n' +
            '\tleft join public.goods as goods\n' +
            '\ton ordered.good = goods.code\n' +
            ') as ogd\n' +
            'on ord.id = ogd."order"\n' +
            filterText +
            'order by ord.id DESC;')
        .then(orders => res.json(orders.rows))
        .catch(e => console.error(e.stack));

};

const handleOrderPost = (req, res) => {

    const body = req.body;

    client
        .query(`INSERT INTO public.orders (client,status,comm, delivery, delivery_address, delivery_date) 
            VALUES (${body.inn},'Новый','${body.comment}', ${body.delivery}, '${body.delivery_address}','${body.delivery_date}') RETURNING id;`)
        .then( result => {
            return client.query('INSERT INTO public.ordered_goods ("order",good,amount,price) VALUES ' +
                body.orderedGoods.reduce((accum, elem, i, arr) => {
                    accum += `(${result.rows[0].id}, '${elem.good}', ${elem.ammount}, ${elem.price})` + ((i===arr.length-1) ? ' ':', ');
                    return accum;
                }, '')
            )
        })
        .then(result => res.json('order was created'))
        .catch(e => console.error(e.stack));

    // 'INSERT INTO public.ordered_goods ("order",good,amount,price)\n' +
    // '\tVALUES (22,\'14605\',1111,121);'

};

const handleOrderStatusUpdate = (req, res) => {

    client
        .query(`UPDATE public.orders SET status='${req.body.status}' WHERE id=${req.params.order}`)
        .then(orders => res.json('status for order ' + req.params.order + ' updated successfully'))
        .catch(e => console.error(e.stack));

};

const handleClientsGet = (req, res) => {

    const inn = req.query.inn;
    const created = req.query.created;

    let condition = "";
    if (inn) {
        condition = `where inn = ${inn};`;
    } else if (created) {
        condition = `where created >= '${created}';`;
    }

    client
        .query('SELECT inn, kpp, "name", email, phone, contact, address, created\n' +
            'FROM public.users\n' +
            condition)
        .then(clients => res.json(clients.rows))
        .catch(e => console.error(e.stack));
};

module.exports = {handleOrdersGet, handleOrderStatusUpdate, handleClientsGet, handleOrderPost};