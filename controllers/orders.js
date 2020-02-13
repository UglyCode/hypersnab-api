const {Client} = require('pg');
const connectionString = process.env.DATABASE_URL;
const client = new Client({
    connectionString: connectionString,
});
client.connect();

const handleOrdersGet = (req, res) => {

    let statusFilter = req.query.status;

    client
        .query('SELECT ord.id as orderId, ord.client, ord.status, ogd.good, ogd.amount, ogd.price\n' +
            'FROM public.orders as ord \n' +
            'inner join public.ordered_goods as ogd\n' +
            'on ord.id = ogd."order"\n' +
            ((statusFilter) ? `where ord.status = '${statusFilter}'\n` : '') +
            'order by ord.id;')
        .then(orders => res.json(orders.rows))
        .catch(e => console.error(e.stack));

};

const handleOrderStatusUpdate = (req, res) => {

    client
        .query(`UPDATE public.orders SET status='${req.body.status}' WHERE id=${req.params.order}`)
        .then(orders => res.json('status for order ' + req.params.order + ' updated successfully'))
        .catch(e => console.error(e.stack));

};


module.exports = {handleOrdersGet, handleOrderStatusUpdate};