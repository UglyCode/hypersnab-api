const express = require('express');
const bp = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');
const morgan = require('morgan');
const register = require('./controllers/register');
const signIn = require('./controllers/signIn');
const profile = require('./controllers/profile');
const auth = require('./middleware/authorization');
const infoInn = require('./controllers/infoInn');
const goods = require('./controllers/goods');
const orders = require('./controllers/orders');
const DATABASE_LINK = process.env.DATABASE_URL;

const pg = knex({
   client: 'pg',
   connection: {
      connectionString: DATABASE_LINK,
      ssl: false
   }
});

const app = express();
app.use(cors());
app.use(morgan('tiny'));
app.use('/static',express.static(__dirname + '/public'));
app.use(bp.json());

app.post('/signIn', signIn.signInAuth(pg, bcrypt));

app.post('/register', (req,res) => register.handleRegister(req, res, pg, bcrypt));

app.get('/profile/:inn', auth.requireAuth, (req, res) => {profile.handleProfileGet(req, res, pg)});
app.post('/profile/:inn', auth.requireAuth, (req, res) => {profile.handleProfileUpdate(req,res,pg)});
app.post('/spec_prices/:inn', (req,res) => profile.handleSpecPricePost(req,res,pg));

app.get('/info/:inn', (req,res) => infoInn.checkInnInfo(req,res,pg));

app.get('/data/:inn', (req,res) => infoInn.getInfoByInn(req,res,pg));

app.get('/goods', (req,res) => goods.handleGoodsGet(req,res));
app.get('/goods/:folder', (req,res) => goods.handleGoodsGet(req,res));
app.post('/goods', (req,res) => goods.handleGoodsPost(req,res));

app.post('/prices', (req,res) => goods.handlePricePost(req,res));
app.post('/spec_prices', (req,res) => goods.handleSpecPricePost(req,res));


app.post('/stock', (req,res) => goods.handleStockPost(req,res));

app.get('/folders', (req,res) => goods.handleFoldersGet(req,res));
app.post('/folders', (req,res) => goods.handleFoldersPost(req,res));

app.get('/attributes/:good', (req,res) => goods.handleAttributesGet(req,res));
app.post('/attributes/:good', (req,res) => goods.handleGoodAttributesPost(req,res));
app.post('/attributes_list', (req,res) => goods.handleAttributesPost(req,res));

app.get('/filters/:folder', (req,res) => goods.handleFiltersGet(req,res));

app.get('/clients', (req,res) => orders.handleClientsGet(req, res));

app.get('/orders', (req,res) => orders.handleOrdersGet(req, res));
app.post('/orders', auth.requireAuth, (req,res) => orders.handleOrderPost(req, res));
app.post('/orders/:order', (req,res) => orders.handleOrderStatusUpdate(req, res));


const PORT = process.env.PORT || 3001;

app.listen(PORT, ()=>{
   console.log(`server started at port: ${PORT}`);
});
