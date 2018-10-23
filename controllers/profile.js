const handleProfile = (req,res,db)=> {
    const {id} = req.params;
    
    db.select("*").from("users").where("id",id).then(user=>{
        if(user.length) {
            res.json(user[0])
        }else {
            res.status(400).json("User not found!")
        }
        
    }).catch(err=> {
        res.status(400).json("getting some problems here!")
    })
    
    }

 const handleProfileUpdate = (req,res,db)=> {
     const {id} = req.params;
     const {name, age,pet} = req.body.formInput

     db('users').where({id: id}).update({name:name,age:age,pet:pet}).then(resp=> {
         if(resp) {
             res.json('success')
         } else {
             res.status(400).json('Unable to update')
         }
     }).catch(err=> res.status(400).json('error updating user'))
 }   
module.exports = {
    handleProfile: handleProfile,
    handleProfileUpdate: handleProfileUpdate
}