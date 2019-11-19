const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const mongoose = require("mongoose")
const createError = require("http-errors")

const config = require("./config")

const app = express()

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))



mongoose
    .connect(config.db, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true
    })
    .then(() => 
        console.log(`Connected to MongoDB at ${ config.db }...`)
    )
    .catch(err => {
        console.log("Failed to connect to Mongodb...", err)
        process.exit()        
    })


const usersRouter = require("./routes/users")

app.use('/api/users', usersRouter)

app.use((req,res, next) => {
    next(createError(404))
})

app.use(function(err, req, res, next){
    res.locals.message = err.message
    res.status(err.status || 500)
    res.send(err)
})

module.exports = app
