const jwt = require('jsonwebtoken');
const User = require('../model/User');
const auth  = async (req, res, next)=>{
    try{
        const token = req.header('Authorization').replace('Bearer ', '');
        // verified token 
        const decoded = await jwt.verify(token, 'secret');
        if(!decoded){
            console.log('token invalid')
        }
        // find if user is valid
        const user = await User.findOne({where:{
            user_email: decoded.data.user_email
        }})
        if(!user){
            res.status(404).send('user not found')
        }
        req.user = user
        next();
    }catch(e){
        res.status(404).send('Token invalid')
    }
   
}

module.exports = auth;