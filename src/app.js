require('./db/mongoose')
const express = require('express')
const app = express()
const port = process.env.PORT || 3000

const freelancerRoute = require('./routes/freelancerRoute')
const HireRoute = require('./routes/hireRoute')

app.use(express.json())
app.use(freelancerRoute)
app.use(HireRoute)





app.listen(port,()=>{
    console.log('Server is up at',port);
})