const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require("bcrypt-nodejs");
const knex = require('knex');
require('dotenv').config()
//CONTROLLERS
const register =  require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');
const auth = require('./controllers/authorization')

// const db = knex({
//     client: 'pg',
//     connection: {
//         connectionString: process.env.DATABASE_URL,
//       ssl: true
//     }
//   });
const db = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      user : 'maniek',
      password : '',
      database : 'smart-brain'
    }
  });


const app = express();
const cors = require("cors");

app.use(bodyParser.json());
app.use(cors());
 


app.get('/',(req,res)=> {
    res.send("App is working");
})
 
// app.post('/signin',(req,res) => {signin.handleSignin(req, res, db, bcrypt)});
 
app.post('/signin',signin.signinAuthentication(db,bcrypt))

app.post('/register',(req,res) => {register.handleRegister(req, res, db, bcrypt)})

app.get('/profile/:id',auth.requireAuth,(req,res) => {profile.handleProfile(req, res, db)})

app.post('/profile/:id',auth.requireAuth,(req,res)=> {
    profile.handleProfileUpdate(req,res,db)
})

 

app.put('/image',auth.requireAuth,(req,res) => {image.imageHandler(req, res, db)})

app.post('/imageurl',auth.requireAuth,(req,res)=>{image.handleApiCall(req, res)})



app.listen(process.env.PORT || 3000,()=> {
    console.log(`Server running on port ${process.env.PORT} 3000`)
})

