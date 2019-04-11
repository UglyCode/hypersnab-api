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

const PORT = process.env.PORT || 3001;
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
app.use(bp.json());

app.get('/', (req, res)=>{
   pg.select('*').from('users')
       .then(response => res.json(response));
});


app.post('/signIn', signIn.signInAuth(pg, bcrypt));

app.post('/register', (req,res) => register.handleRegister(req, res, pg, bcrypt));

app.get('/profile/:inn', auth.requireAuth, (req, res) => {profile.handleProfileGet(req, res, pg)});

app.post('/profile/:inn', auth.requireAuth, (req, res) => {profile.handleProfileUpdate(req,res,pg)});



app.listen(PORT, ()=>{
   console.log(`server started at port: ${PORT}`);
});