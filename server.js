const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require("bcrypt");
const cors = require('cors');
const knex = require('knex');
const register = require('./controllers/register');
const login = require("./controllers/login");
const serverpos = require("./controllers/serverpos");
const shuttable = require("./controllers/shuttable");
const path = require('path');

// database connection
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";    // for self_signed_cert

const db =  knex({
  client: 'pg',
  connection: {
   connectionString : process.env.DATABASE_URL,    // from heroku addons
   ssl : true
  }
});

const app = express();
app.use(bodyParser.json());       // this middleware allows us to use request body
app.use(cors());                  // middleware for cors issues

const port = process.env.PORT || 3001;   //process.env.PORT (uses prot given by heroku otherwise runs on localhost)
app.get('/', (req,res) => res.json('working'));
app.post('/signup',(req , res) => {register.handleSignup(req , res , db , bcrypt)});
app.post('/login',(req, res) => {login.handleLogin(req, res, db, bcrypt)});
app.get('/serverpos/:username',(req , res) => {serverpos.getPlayerPos(req, res, db)});
app.get('/serverpos', (req, res) => {serverpos.getServerPos(req, res, db)});
app.put('/shuttable', (req, res) => {shuttable.setResults(req, res, db)});

app.listen(port , () => {
	console.log(`App is successfully running on port ${port}`);
});