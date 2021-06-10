const express  = require('express');
const auth = require('../middleware/auth');
const Post = require('../model/Post');
const router  = express.Router();

router.get('/', async (req, res) =>{
     try{
         const blogs = await Post.findAll();
         if(!blogs){
             return res.status(404).send('not blogs')
         }
         return res.status(201).send(blogs)
     }catch(e){
         return res.status(501).send('internal server error');
     }
});

router.get('/post', auth, async (req, res) =>{
    try{
       const blog =  await Post.findAll({
           where: {
               UserId: req.user.id
           }
       });
       if(!blog){
           return res.status(404).send('note not found')
       }
       return res.status(201).send(blog)
    }catch(e){
        return res.status(501).send('internal server error')
    }
})

router.post('/post', auth, async (req, res) =>{
    try{
        const {title, describe} = req.body
        const blog = await Post.create({
            title: title,
            description: describe,
            UserId: req.user.id
        });
        if(!blog){
            return res.status(400).send('cannot post blog')
        }
        return res.status(201).send(blog)
    }catch(e){
        return res.status(501).send('internal server error')
    }
});

router.patch('/edit/:username/:id', auth, async (req, res)=>{
        try{
            const {title , describe } = req.body;
            const blog = await Post.update({
                title: title,
                description: describe,
            },{
                where: {
                    UserId: req.user.id,
                    id: req.params.id
                }
            });
            if(!blog){
                return res.status(404).send('blog not found')
            }
            return res.status(201).send('updated')
        }catch(e){
            return res.status(501).send('internal server error')
        }
});

router.delete('/delete/:username/:id', auth, async (req, res)=>{
    try{
        const deleteBlog = await Post.destroy({
            where: {
                UserId: req.user.id,
                id: req.params.id
            }
        });
        if(!deleteBlog){
            return res.status(404).send('no blog to delete');
        }
        return res.send(deleteBlog)
    }catch(e){
        return res.status(501).send('internal server error');
    }
})
module.exports = router;