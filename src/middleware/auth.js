const jwt = require('jsonwebtoken')
const Freelancer = require('../models/freelancerModel')
const Hire = require('../models/hireModel')

const authToken = async(req,res,next)=>{
    const token = req.header('Authorization').replace('Bearer ','')
    const decoded = jwt.verify(token,'secretKey')
    const user = await Freelancer.findOne({_id:decoded._id,'tokens.token':token})

    if(!user){
        const hire = await Hire.findOne({_id:decoded._id,'tokens.token':token})
        req.hire = hire
        req.token = token
        next()
    }
    
    req.user = user
    req.token = token
    next()
}

module.exports = authToken