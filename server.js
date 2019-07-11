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
const DATABASE_LINK = process.env.DATABASE_URL;

console.log("NODE_ENV: " + process.env.NODE_ENV);

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
app.use(bp.json());

app.get('/', (req, res)=>{
   pg.select('*').from('users')
       .then(response => res.json(response));
});


app.post('/signIn', signIn.signInAuth(pg, bcrypt));

app.post('/register', (req,res) => register.handleRegister(req, res, pg, bcrypt));

app.get('/profile/:inn', auth.requireAuth, (req, res) => {profile.handleProfileGet(req, res, pg)});

app.post('/profile/:inn', auth.requireAuth, (req, res) => {profile.handleProfileUpdate(req,res,pg)});

app.get('/info/:inn', (req,res) => infoInn.checkInnInfo(req,res,pg));

app.get('/data/:inn', (req,res) => infoInn.getInfoByInn(req,res,pg));


app.listen(process.env.PORT || 3001, ()=>{
   console.log(`server started at port: ${process.env.PORT || 3001}`);
});

//TODO:
// 1. DONE! GET /info/:inn - check if there is inn in data base, or fetch data from API by inn otherwise. field userExists - obligatory in return
// 2. DONE! POST /register - creates user using form data, returns JWT if success
// 3. DONE! POST /signIn - checks pwd for inn or authkey JWT.
// 4. DONE! GET /profile/:inn - returns user data from database. AUTHCHECK!
// 5. NOT DONE YET! POST /profile/:inn - udate prfile data with new 