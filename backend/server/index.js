import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'

import userRouter from './routes/user/index.js'
import adminRouter from './routes/admin/index.js'


import dotenv from 'dotenv'
import path from 'path'
import gameRouter from './routes/game/index.js'


const app = express()
const port = process.env.PORT || 3001

// const __dirname = path.resolve()
// dotenv.config({path:path.resolve(__dirname, '.env')})

app.use(bodyParser.json())
app.use(cors())

app.use(userRouter)
app.use(adminRouter)
app.use(gameRouter)

app.get('/', (req, res)=>{
    res.send("Welcome to housie")
})

app.listen(port, ()=>{
    console.log("server is up and running on port ", port)
})