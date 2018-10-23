const jwt = require('jsonwebtoken');
let redis     = require('redis'),

  redisClient    = redis.createClient({
    port      : process.env.REDIS_PORT,               
    host      : process.env.REDIS_HOST,       
    password  : process.env.REDIS_PASSWORD,  
    
  });

redisClient.on('connect',()=> {
    console.log('connected')
})
 

const handleSignin = (db, bcrypt,req,res)=> {
    const {email, password} = req.body;
    if(!email || !password) {
        return Promise.reject("Please enter your details correctly");
      }

       return db.select('email','hash').from('login')
        .where('email', '=', email).then(data=> {
          const passValid= bcrypt.compareSync(password, data[0].hash)

          if(passValid) {
           return  db.select('*').from('users')
           .where('email',email)
           .then(user=> user[0])
           .catch(err=>Promise.reject("Unable to signin"))
          }else {
              Promise.reject("wrong credentials")
          }
        })
       .catch(err=>err)
     
    
    }

const getAuthTokenId =(req,res)=> {
    const {authorization} = req.headers;

   return redisClient.get(authorization,(err,reply)=> {
      if(err || !reply) {
          return res.status(400).json('Unauthorized')
      }
      return res.json({id:reply})
    })
}

const signToken = (email) => {
    const jwtPayload = {email}
    return jwt.sign(jwtPayload,'secret',{expiresIn: '2 days'})
}

const setToken = (key,value) => {
 return Promise.resolve(redisClient.set(key,value))
}

const createSessions = (user) => {
const {email, id} = user;
const token = signToken(email);

return setToken(token,id).then(()=>{
    redisClient.get(token, (err, reply)=> {

    console.log(reply);
});

    return {success: 'true', userId: id, token: token}
         })
         .catch(console.log)


}

 
const signinAuthentication = (db,bcrypt)=>(req,res)=> {
        const {authorization} = req.headers;
        return authorization ? getAuthTokenId(req,res) : handleSignin(db,bcrypt,req,res).
        then(data=> {

           return data.id && data.email ? createSessions(data) : Promise.reject(data)
            })
            .then(session=>res.json(session))
            .catch(err=>res.status(400).json(err))
    }
    module.exports = {
        signinAuthentication: signinAuthentication
    }