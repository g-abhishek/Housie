import mongoose from '../../connect.js'
import crypto from 'crypto'
import {v1 as uuid} from 'uuid'

const Admin = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email:{
        type: String,
        unique: true,
        index: true,
        required: true
    },
    salt: {
        type: String
    },
    hashedPassword: {
        type: String
    },
},
{
    timestamps: true
})

Admin.methods.setPassword = function(password){
    this.salt = uuid()
    this.hashedPassword = crypto.createHmac('sha1', this.salt).update(password).digest('hex')
}

Admin.methods.verifyPassword = function(password){
    let hash = crypto.createHmac('sha1', this.salt).update(password).digest('hex')
    return hash === this.hashedPassword
}

export default mongoose.model('Admin', Admin)