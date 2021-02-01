import mongoose from 'mongoose'

import dotenv from 'dotenv'
import path from 'path'

const __dirname = path.resolve()
dotenv.config({
    path: path.resolve(__dirname, '.env')
})

mongoose.connect(
    'mongodb://127.0.0.1:27017/housie',
    { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }
).then(()=>console.log("connected to db"))

mongoose.connection.on('error', (err)=>{
    console.log(`DB connection err ${err.message}`)
})

export default mongoose;