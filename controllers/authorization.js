let redis  = require('redis'),

  redisClient    = redis.createClient({
    port      : process.env.REDIS_PORT,               
    host      : process.env.REDIS_HOST,       
    password  : process.env.REDIS_PASSWORD,  
    
  });

  const requireAuth = (req,res,next)=> {
    const {authorization} = req.headers;
    if(!authorization) {
        return res.status(401).json('unauthrorized')
    }
     return redisClient.get(authorization,(err,reply)=> {
         if(err || !reply) {
             return res.status(401).json('unauthrorized')
         }
         console.log('you can pass my friend')
         return next();
     })
      

  }

  module.exports = {
requireAuth: requireAuth
  }