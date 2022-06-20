const express = require('express')
const dataservice = require('./services/data.service')
const jwt = require('jsonwebtoken')
const cors = require('cors')
const app = express()

app.use(express.json())
app.use(cors({
    origin: 'http://localhost:4200'
}))

const jwtMiddleWare = (req, res, next) => {
    try {
        const token = req.headers["access-token"]
        const data = jwt.verify(token, 'secretkey123')
        req.currentId = data.currentId
        next()
    }
    catch {
        res.status(422).json({
            statusCode: 422,
            status: false,
            message: "please login..."
        })
    }
}

app.post('/register', (req, res) => {
    dataservice.register(req.body.user_id, req.body.password, req.body.uname)
        .then(result => {
            res.status(result.statusCode).json(result)
        })
})

app.post('/login', (req, res) => {
    dataservice.login(req.body.user_id, req.body.password)
        .then(result => {
            res.status(result.statusCode).json(result)
        })
})

app.post('/event', jwtMiddleWare, (req, res) => {
    dataservice.event(req.body.date,req.body.description,req.body.user_id)
        .then(result => {
            res.status(result.statusCode).json(result)
        })
})

app.post('/reminder', jwtMiddleWare, (req, res) => {
    dataservice.getReminder(req.body.user_id)
        .then(result => {
            res.status(result.statusCode).json(result)
        })
})

app.post('/deleteEvent',(req,res)=>{
    dataservice.deleteEvent(req.body.description,req.body.user_id)
  .then(result=>{
  res.status(result.statusCode).json(result)
  })
  })  

  app.post('/updateReminder',(req,res)=>{
    dataservice.updateReminder(req.body.user_id, req.body.indexNum, req.body.date, req.body.description)
  .then(result=>{
  res.status(result.statusCode).json(result)
  })
  })  

app.delete('/deleteAcc/:user_id', jwtMiddleWare, (req, res) => {
    dataservice.deleteAcc(req.params.user_id)
        .then(result => {
            res.status(result.statusCode).json(result)
        })
})

app.listen(3000, () => {
    console.log("server started at 3000");
})