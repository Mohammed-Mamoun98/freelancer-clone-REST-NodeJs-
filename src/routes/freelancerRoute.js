const express = require('express')
const freelancerRoute = express.Router()
const Freelancer = require('../models/freelancerModel')
const Hire = require('../models/hireModel')
const auth = require('../middleware/auth')


freelancerRoute.post('/free',async (req,res)=>{

    const {name,email,password,tags} = req.body
    const tagsArray = tags.split(' ').map((tag)=>{
        return {tag}
    })
    
    const free = new Freelancer({name,email,password,tags:tagsArray})

    if(!free){
        throw new Error('no data!')
    }

    await free.save()
    res.status(201).send(free)
})

freelancerRoute.post('/free/login',async(req,res)=>{

    const {email,password} = req.body
    const user = await Freelancer.findByCredintials(email,password)
    const to = await user.generateAuthTokens()
    res.status(200).send(to)

})

freelancerRoute.patch('/free/me/updateProfile',auth,async (req,res)=>{

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

freelancerRoute.get('/free/me',auth,async (req,res)=>{
    const user = req.user
    if(!user){
        return res.status(404).send({error:'please Authonticate!'})
    }

    res.status(200).send(user)
})



freelancerRoute.get('/free/searchJobs',auth,async (req,res)=>{
    const user = req.user
    if(!user){
        return res.status(404).send({error:'please Authonticate!'})
    }
    
    var jobsArray = []
    const allHires = await Hire.find()
    allHires.forEach((hire)=>{
        hire.posts.forEach((post)=>{
            jobsArray.push(post)
            console.log(post);
        })
    })
    res.send(jobsArray)
})


freelancerRoute.get('/free/me/logout',auth,async (req,res)=>{
    const user = req.user
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

freelancerRoute.get('/free/me/logoutAll',auth,async (req,res)=>{
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

module.exports = freelancerRoute