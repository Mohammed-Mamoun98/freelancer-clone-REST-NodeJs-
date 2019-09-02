const express = require('express')
const HireRoute = express.Router()
const Hire = require('../models/hireModel')
const auth = require('../middleware/auth')

HireRoute.post('/hire',async (req,res)=>{

    const {name,email,password,age} = req.body
   
    
    const user = new Hire({name,email,password,age})

    if(!user){
        throw new Error('no data!')
    }

    await user.save()
    res.status(201).send(user)
})

HireRoute.post('/hire/login',async(req,res)=>{

    const {email,password} = req.body
    const user = await Hire.findByCredintials(email,password)
    const to = await user.generateAuthTokens()
    res.status(200).send(to)

})

HireRoute.patch('/hire/me/updateProfile',auth,async (req,res)=>{

    const updates = Object.keys(req.body)
    const user = req.user._doc
    const allowedUpdates = Object.keys(user)
    const isAllowed = updates.every((update)=>{
        return allowedUpdates.includes(update)
    })

    if(!isAllowed){
        return res.send({error:'invalid update feilds!'})
    }
    
    const arr =Object.values(updates)

    arr.forEach((a)=>{
        console.log(updates[a]);
    })
})

HireRoute.get('/hire/me',auth,async (req,res)=>{
    const user = req.hire
    if(!user){
        return res.status(404).send({error:'please Authonticate!'})
    }

    res.status(200).send(user)
})


HireRoute.get('/hire/me/logout',auth,async (req,res)=>{
    const user = req.hire
    const currentToken = req.token
    console.log(currentToken);
    if(!user){
        return res.status(404).send({error:'please Authonticate!'})
    }

    user.tokens = user.tokens.filter((value)=>{
        return value.token != currentToken 
    })
    const newtokens = await user.save()
    res.status(200).send(newtokens)
})

HireRoute.get('/hire/me/logoutAll',auth,async (req,res)=>{
    const user = req.user
    const currentToken = req.token
    console.log(currentToken);
    if(!user){
        return res.status(404).send({error:'please Authonticate!'})
    }

    user.tokens = []
    await user.save()
    res.send({message:'you just logout all sessions'})
})

HireRoute.post('/hire/me/addpost',auth,async (req,res)=>{
    const user = req.hire
    const {header,body,tags} = req.body

    const tagsArray = tags.split(' ').map((tag)=>{
        return {tag}
    })


    

    const post = {header,body,tags: tagsArray}
    console.log(post);

    user.posts = user.posts.concat({post})


  //  user.posts = user.posts.concat({header,body,tags: tagsArray})
    await user.save()
    
    // user.posts = user.posts.concat({header:'ada',body:'alfna',tags:[{}]})
    res.send(user)
})
 
module.exports = HireRoute 