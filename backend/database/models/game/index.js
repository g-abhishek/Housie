import mongoose from '../../connect.js'

const Users = new mongoose.Schema({
    mobile: {
        type: Number,
        required: true,
        index: true,
    },
    ticket: {
        type: Array,
        required: true
    },
    done: {
        type: Array,
        default: []
    },
    wrongInput: {
        type: Array,
    },
    isTerminated: {
        type: Boolean,
        default: false
    }
},{
    timestamps: true
})

const Game = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    users:  [ Users ],
    done: {
        type: Array,
    },
    topLine: {
        type: Array,
    },
    middleLine: {
        type: Array,
    },
    bottomLine: {
        type: Array,
    },
    fullHousie: {
        type: Array,
    },
},{
    timestamps: true
})

export default mongoose.model("Game", Game)