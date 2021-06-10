const express = require('express');
const User = require('../model/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const router = express.Router();


router.get('/', async (req, res) =>{
    res.send('get user router');
});

router.post('/signup', async (req, res)=>{
    try{
        const user_from_client = req.body;
        // check if user already exist
        const user_from_db = await User.findOne({
            where:{
                user_email: user_from_client.user_email
            }
        });
        if(!user_from_db){
            // hash password before save to db
            const hashed_password = await bcrypt.hash(user_from_client.user_password, 8);
            if(!hashed_password){
                res.status(400).json({
                    status: '400',
                    error: 'password cannot hash'
                })
            }
            user_from_client.user_password = hashed_password

            // save users
            const user = await User.create(user_from_client);
            if(!user){
                return res.status(404).json({
                    status: '404',
                    error: 'user not found'
                })
            }
            return res.status(201).json({
                status: 'created',
                data: 'user created'
            })
        }
        return res.status(400).json({
            status: "error",
            error: "user already existed"
        })
        
    }catch(e){
        return res.status(501).json({
            status: "internal server error",
            error: "internal server error"
        })
    }
});

router.post('/signin', async (req, res) =>{
    try{
        const user_from_client = req.body;

        // find user from db
        const user_from_db = await User.findOne({where:{
            user_email : user_from_client.user_email
        }})
        if(!user_from_client){
           return res.status(404).send('Acc do not existed')
        }
        // compare password
        const isMatched = await bcrypt.compare(user_from_client.user_password, user_from_db.user_password);
        if(!isMatched){
           return res.status(404).send('Acc do not existed');
        }
        
        // create jsonwebtoken for user
        const token = await jwt.sign({
            exp: Math.floor(Date.now() / 1000) + (60 * 60*24*7),
            data: {
                    user_email: user_from_db.user_email,
                    created_at: user_from_db.createdAt
                  }
          }, 'secret');
        if(!token){
           return res.status(404).send('cannot create token')
        }
        return res.status(201).send({
            token: token,
            user: user_from_db.user_name
        })
    }catch(e){
        return res.status(501).send('internal server error.')
    }
});

router.post('/signout', auth ,async (req, res)=>{
    return res.status(201).send({
        token: '',
        user: 'unknown'
    })
});

module.exports = router;