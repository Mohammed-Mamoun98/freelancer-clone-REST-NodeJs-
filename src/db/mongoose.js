const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/freelancerApp',{
    useNewUrlParser:true,
    useCreateIndex: true,
    useFindAndModify: false
})

