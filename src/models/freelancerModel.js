const mongoose = require('mongoose')
const bcypt = require('bcrypt')
const validator = require('validator')
const jwt = require('jsonwebtoken')

const freelancerSchema = mongoose.Schema({
    name:{
        type: String,
        trim: true,
        unique: true,
        required: true
    },
    email:{
        type: String,
        trim: true,
        unique: true,
        required: true,
        lowercase: true,

        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('invalid email!')
            }


        }
    },
    password:{
        type: String,
        trim: true,
        required: true,
        minlength:6,
        validate(value){
            if(value.includes('password')){
                throw new Error('password cant contain password!')
            }
        }

    },
    age:{
        type: Number,
        validate(value){
            if(value < 0){
                throw new Error('negative age value!')
            }
        }
    },

    tags:[{
        tag:{
            type:String,
            lowercase: true
        }
    }
    ],
    tokens:[
        {
            token:{
                type:String,
                required:true   
            }
        }
    ]
})


freelancerSchema.statics.findByCredintials = async(email,password)=>{
    const user  = await freelancerModel.findOne({email})

    if(!user){
        throw new Error('unable to login!')
    }

    const isMatch = await bcypt.compare(password,user.password)

    if(!isMatch){
        throw new Error('unable to login!')
    }

    return user

    
}

freelancerSchema.methods.generateAuthTokens = async function(){
   
    const user = this
    const token = jwt.sign({_id:user._id.toString()},'secretKey')
    user.tokens = user.tokens.concat({token})
    await user.save()
    return{user,token}




}

freelancerSchema.pre('save',async function(save){
    const user = this

    if(user.isModified('password')){
        user.password = await bcypt.hash(user.password,8)
    }

    save()
})

const freelancerModel = mongoose.model('freelancer',freelancerSchema)

module.exports = freelancerModel