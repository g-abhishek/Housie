import mongoose from '../../connect.js'


let Schema = mongoose.Schema;

const User = new Schema({
    name: {
        type: String,
        required: true,
    },
    mobile: {
        type: String,
        required: true,
        index: true,
        unique: true
    },
},{
    timestamps: true
})

export default mongoose.model('User', User)