const mongoose = require('mongoose')
const bcypt = require('bcrypt')
const validator = require('validator')
const jwt = require('jsonwebtoken')

const hireSchema = mongoose.Schema({
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

    posts:[ {
        post:{
           
            header: 
            {
                type: String,
                default: 'no'
            
            },
            
            body: {
                type: String,
                default: 'no'
            },
            
            
            tags:[{
                tag:{
                    type:String,
                    lowercase: true
                }
            }
            ]
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


hireSchema.statics.findByCredintials = async(email,password)=>{
    const user  = await hireModel.findOne({email})

    if(!user){
        throw new Error('unable to login!')
    }

    const isMatch = await bcypt.compare(password,user.password)

    if(!isMatch){
        throw new Error('unable to login!')
    }

    return user

    
}

hireSchema.methods.generateAuthTokens = async function(){
   
    const user = this
    const token = jwt.sign({_id:user._id.toString()},'secretKey')
    user.tokens = user.tokens.concat({token})
    await user.save()
    return{user,token}




}

hireSchema.pre('save',async function(save){
    const user = this

    if(user.isModified('password')){
        user.password = await bcypt.hash(user.password,8)
    }

    save()
})

const hireModel = mongoose.model('hire',hireSchema)

module.exports = hireModel