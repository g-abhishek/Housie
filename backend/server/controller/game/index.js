import Game from '../../../database/models/game/index.js'
import User from '../../../database/models/users/index.js'
import tambola from 'tambola-generator'

export function createGame(req, res) {
    console.log(req.body)
    Game.create(req.body).then(result => {
        console.log(result)
        return res.send({
            statusCode: 200,
            message: "Game Created",
            game: result
        })
    }).catch(error => {
        return res.status(500).send(error.message)
    })
}


export function joinGame(req, res) {
    console.log(req.params)
    User.findOne({ mobile: req.params.mob }).then(user => {
        if (user === null) {
            return res.send({
                statusCode: 404,
                message: "Please Register First",
                link: "http://localhost:3000/registration"
            })
        } else {
            let userSchema = {
                mobile: req.params.mob,
                ticket: tambola.getTickets(1)[0]
            }
            Game.findOne({ _id: req.params.gid, users: { $elemMatch: { mobile: req.params.mob } } }).then(user => {
                if (user !== null) {
                    return res.send({
                        statusCode: 201,
                        message: "User Already registred for the game"
                    })
                } else {
                    Game.findByIdAndUpdate(req.params.gid, {$push: {users: userSchema}}, {new:true}).then(result => {
                        if(result === null){
                            return res.send({
                                statusCode: 404,
                                message: "Game not found"
                            })
                        }
                        return res.send(result)
                    }).catch(error => {
                        return res.status(500).send(error.message)
                    })
                }
            })

        }
    }).catch(error => {
        return res.status(500).send(error.message)
    })
}