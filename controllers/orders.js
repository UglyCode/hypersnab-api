const {Client} = require('pg');
const connectionString = process.env.DATABASE_URL;
const client = new Client({
    connectionString: connectionString,
});
client.connect();

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
        .query('SELECT ord.id as orderId, ord.updated, ord.client, ord.status, ogd.good, ogd.amount, ogd.price,\n' +
            '\togd.description, round(cast(ogd.amount*ogd.price as numeric), 2 ) as sum\n' +
            'FROM public.orders as ord \n' +
            'inner join (\n' +
            '\tselect ordered."order", ordered.good, ordered.amount, ordered.price, goods.description\n' +
            '\tfrom public.ordered_goods as ordered\n' +
            '\tleft join public.goods as goods\n' +
            '\ton ordered.good = goods.code\n' +
            ') as ogd\n' +
            'on ord.id = ogd."order"\n' +
            filterText +
            'order by ord.id;')
        .then(orders => res.json(orders.rows))
        .catch(e => console.error(e.stack));

};

const handleOrderPost = (req, res) => {

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

module.exports = {handleOrdersGet, handleOrderStatusUpdate, handleClientsGet};