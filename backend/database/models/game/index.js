import mongoose from '../../connect.js'

const Users = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
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
        type: Number,
        default: 0
    },
    isTerminated: {
        type: Boolean,
        default: false
    }
},{
    timestamps: true
})

const wUsers = new mongoose.Schema({
    
    name: {
        type: String,
        required: true,
    },
    mobile: {
        type: Number,
        required: true,
        index: true,
    },
    isWinner: {
        type: Boolean,
        default: false
    }
},{
    timestamps: true
})

const Game = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    uniqueName: {
        type: String,
        required: true,
    },
    isOnGoing:{
        type: Boolean,
        default: false
    },
    time: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    gameDate: {
        type: Date,
        required: true
    },
    users:  [ Users ],
    done: {
        type: Array,
    },
    topLine: [wUsers],
    middleLine: [wUsers],
    bottomLine: [wUsers],
    fullHousie: [wUsers],
},{
    timestamps: true
})

export default mongoose.model("Game", Game)