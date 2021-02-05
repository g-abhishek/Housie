import Game from '../../../database/models/game/index.js'
import User from '../../../database/models/users/index.js'
import tambola from 'tambola-generator'
import mongoose from '../../../database/connect.js'
import cron from 'node-cron'
import twilio from 'twilio';
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioNumber = process.env.TWILIO_NUMBER;
const cl = twilio(accountSid, authToken);
const { MessagingResponse } = twilio.twiml;
// const MessagingResponse = require('twilio').twiml.MessagingResponse;


// const cl = twilio(accountSid, authToken);

export function senSms(req, res) {
    // console.log(req)
    // cl.messages.create({
    //      from: 'whatsapp:+14155238886',
    //      body: 'Hello, there!',
    //      to: 'whatsapp:+917038662334'
    //    })
    //   .then(message => console.log(message)
    //   ).catch(error => {
    //       return res.send(error)
    //   });
}

export function createGame(req, res) {
    console.log(req.body)
    console.log(new Date().toUTCString())
    let gameSchema = req.body
    gameSchema.gameDate = new Date(`${req.body.date} ${req.body.time}`)
    Game.findOne({ uniqueName: gameSchema.uniqueName }).then(result => {
        console.log(result)
        if (result === null) {
            console.log("creation")
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
        } else {
            console.log("rejection")
            return res.send({
                statusCode: 201,
                message: "Name is already in use, please choose different Name"
            })
        }
    }).catch(error => {
        return res.status(500).send(error.message)
    })

}



export function fetchAllGame(req, res) {
    Game.find({ gameDate: { $gte: new Date() } }).select(" name gameDate uniqueName users createdAt done ").then(result => {
        console.log(result)
        return res.send({
            statusCode: 200,
            result: result,
        })
    })
}
export function startGame(req, res) {
    console.log("start", req.body)
    Game.findOneAndUpdate(
        { _id: req.body.gid, isOnGoing: false },
        { $set: { isOnGoing: true } }
    ).then(result => {
        console.log(result)
        if (result === null) {
            return res.send({
                statusCode: 404,
                message: "Not Found"
            })
        }
        return res.send({
            statusCode: 200,
            result: result,
        })
    }).catch(error => {
        return res.status(500).send(error.message)
    })
}
export function onGoingGame(req, res) {
    console.log("onGoingGame=============")
    Game.findOne(
        { isOnGoing: true }
    ).then(result => {
        console.log(result)
        if (result === null) {
            return res.send({
                statusCode: 404,
                message: "Not Found"
            })
        }
        return res.send({
            statusCode: 200,
            result: result,
        })
    }).catch(error => {
        return res.status(500).send(error.message)
    })
}

export function stopGame(req, res) {
    console.log("stop", req.body)
    Game.findOneAndUpdate(
        { _id: req.body.gid, isOnGoing: true },
        { $set: { isOnGoing: false } }
    ).then(result => {
        console.log(result)
        if (result === null) {
            return res.send({
                statusCode: 404,
                message: "Not Found"
            })
        }
        return res.send({
            statusCode: 200,
            result: result,
        })
    }).catch(error => {
        return res.status(500).send(error.message)
    })
}

export function appearedNumbers(req, res) {
    console.log(req.body)
    Game.findByIdAndUpdate(req.body.gid, { $addToSet: { "done": req.body.num } }, { new: true }).then(result => {
        console.log(result)
        if (result === null) {
            return res.send({
                statusCode: 404,
                message: "No game found",
            })
        }
        return res.send({
            statusCode: 200,
            message: "Done",
        })
    }).catch(error => {
        return res.status(500).send(error.message)
    })
}

export function completedUsers(req, res) {
    console.log(req.params)
    Game.findById(req.params.gid).select(" topLine middleLine bottomLine fullHousie ").then(result => {
        console.log(result)
        if (result === null) {
            return res.send({
                statusCode: 404,
                message: "No game found",
            })
        }
        return res.send({
            statusCode: 200,
            result: result,
        })
    }).catch(error => {
        return res.status(500).send(error.message)
    })
}

export function completedTopLineUsers(req, res) {
    console.log(req.params)
    Game.findById(req.params.gid).select(" topLine ").then(result => {
        console.log(result)
        if (result === null) {
            return res.send({
                statusCode: 404,
                message: "No game found",
            })
        }
        return res.send({
            statusCode: 200,
            result: result,
        })
    }).catch(error => {
        return res.status(500).send(error.message)
    })
}

export function completedMiddleLineUsers(req, res) {
    console.log(req.params)
    Game.findById(req.params.gid).select(" middleLine ").then(result => {
        console.log(result)
        if (result === null) {
            return res.send({
                statusCode: 404,
                message: "No game found",
            })
        }
        return res.send({
            statusCode: 200,
            result: result,
        })
    }).catch(error => {
        return res.status(500).send(error.message)
    })
}
export function completedBottomLineUsers(req, res) {
    console.log(req.params)
    Game.findById(req.params.gid).select(" bottomLine ").then(result => {
        console.log(result)
        if (result === null) {
            return res.send({
                statusCode: 404,
                message: "No game found",
            })
        }
        return res.send({
            statusCode: 200,
            result: result,
        })
    }).catch(error => {
        return res.status(500).send(error.message)
    })
}
export function completedFullHousieUsers(req, res) {
    console.log(req.params)
    Game.findById(req.params.gid).select(" fullHousie ").then(result => {
        console.log(result)
        if (result === null) {
            return res.send({
                statusCode: 404,
                message: "No game found",
            })
        }
        return res.send({
            statusCode: 200,
            result: result,
        })
    }).catch(error => {
        return res.status(500).send(error.message)
    })
}

export function fetchWinnerUsers(req, res) {
    Game.findOne(
        { _id: req.params.gid },
        {
            topLine: { $elemMatch: { isWinner: true } },
            middleLine: { $elemMatch: { isWinner: true } },
            bottomLine: { $elemMatch: { isWinner: true } },
            fullHousie: { $elemMatch: { isWinner: true } }
        }
    ).then(result => {
        console.log(result)
        if (result === null) {
            return res.send({
                statusCode: 404,
                result: "Game Not Found"
            })
        }
        return res.send({
            statusCode: 200,
            result: result
        })
    }).catch(error => {
        return res.status(500).send(error.message)
    })
}


export function announceTLWinner(req, res) {
    console.log(req.body)
    Game.findOneAndUpdate(
        { _id: req.body.gid, topLine: { $elemMatch: { mobile: req.body.mob } } },
        { $set: { "topLine.$.isWinner": true } },
        { new: true }).then(user => {
            if (user === null) {
                return res.send({
                    statusCode: 404,
                    message: "No User Found"
                })
            } else {                
                res.send({
                    statusCode: 200,
                    message: "winner announced"
                })
                cl.messages.create({
                    from: `whatsapp:${twilioNumber}`,
                    body: 'Congratulation, You Won Top Line',
                    to: `whatsapp:+91${req.body.mob}`
                })
                .then(message => {
                    console.log(message)                    
                }).catch(error => {
                    res.send(error)
                });
            }
            
        }).catch(error => {
            return res.status(500).send(error.message)
        })
}
export function announceMLWinner(req, res) {
    console.log(req.body)
    Game.findOneAndUpdate(
        { _id: req.body.gid, middleLine: { $elemMatch: { mobile: req.body.mob } } },
        { $set: { "middleLine.$.isWinner": true } },
        { new: true }).then(user => {
            if (user === null) {
                return res.send({
                    statusCode: 404,
                    message: "No User Found"
                })
            }else{
                res.send({
                    statusCode: 200,
                    message: "winner announced"
                })
                cl.messages.create({
                    from: `whatsapp:${twilioNumber}`,
                    body: 'Congratulation, You Won Middle Line',
                    to: `whatsapp:+91${req.body.mob}`
                })
                .then(message => {
                    console.log(message)                    
                }).catch(error => {
                    res.send(error)
                });
            }
            
        }).catch(error => {
            return res.status(500).send(error.message)
        })
}
export function announceBLWinner(req, res) {
    console.log(req.body)
    Game.findOneAndUpdate(
        { _id: req.body.gid, bottomLine: { $elemMatch: { mobile: req.body.mob } } },
        { $set: { "bottomLine.$.isWinner": true } },
        { new: true }).then(user => {
            if (user === null) {
                return res.send({
                    statusCode: 404,
                    message: "No User Found"
                })
            }else{
                res.send({
                    statusCode: 200,
                    message: "winner announced"
                })
                cl.messages.create({
                    from: `whatsapp:${twilioNumber}`,
                    body: 'Congratulation, You Won BOttom Line',
                    to: `whatsapp:+91${req.body.mob}`
                })
                .then(message => {
                    console.log(message)                    
                }).catch(error => {
                    res.send(error)
                });
            }
        }).catch(error => {
            return res.status(500).send(error.message)
        })
}
export function announceFHWinner(req, res) {
    console.log(req.body)
    Game.findOneAndUpdate(
        { _id: req.body.gid, fullHousie: { $elemMatch: { mobile: req.body.mob } } },
        { $set: { "fullHousie.$.isWinner": true } },
        { new: true }).then(user => {
            if (user === null) {
                return res.send({
                    statusCode: 404,
                    message: "No User Found"
                })
            }else{
                res.send({
                    statusCode: 200,
                    message: "winner announced"
                })
                cl.messages.create({
                    from: `whatsapp:${twilioNumber}`,
                    body: 'Congratulation, You Won Full Housie',
                    to: `whatsapp:+91${req.body.mob}`
                })
                .then(message => {
                    console.log(message)                    
                }).catch(error => {
                    res.send(error)
                });
            }
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
                    Game.findByIdAndUpdate(req.params.gid, { $push: { users: userSchema } }, { new: true }).then(result => {
                        if (result === null) {
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


function arrCheck(arr1, arr2) {
    let finArr = arr2
    if (arr2.length === 3) {
        finArr = [...arr2[0], ...arr2[1], ...arr2[2]]
    }
    let result = false
    for (let i = 0; i < finArr.length; i++) {
        if (finArr[i] > 0) {
            if (arr1.includes(finArr[i])) {
                result = true
            } else {
                result = false
            }
        }
    }

    return result
}

export function PlayGame(req, res) {
    console.log(req.params)
    let payload = req.params.payload
    let gid = req.params.gid
    let mob = req.params.mob

    if (!mongoose.Types.ObjectId.isValid(gid)) return res.send("Invalid Object ID")

    User.findOne({ mobile: mob }).then(user => {
        if (user === null) {
            return res.send({
                statusCode: 404,
                message: "Please Register to website First",
                link: "http://localhost:3000/registration"
            })
        } else {
            let userName = user.name;
            // find the game exists or not
            Game.findOne({ _id: gid }).then(result => {
                if (result === null) {
                    return res.send({
                        statusCode: 404,
                        message: "Game Not found"
                    })
                }
                // if game exists
                if (result !== null) {
                    let userSchema = {
                        mobile: mob,
                        name: userName,
                        ticket: tambola.getTickets(1)[0]
                    }
                    //checks for game joining
                    if (payload.includes("JOIN") || payload.includes("join") && payload.length > 2) {

                        Game.findOne({ _id: gid, users: { $elemMatch: { mobile: mob } } }).then(user => {
                            if (user !== null) {
                                return res.send({
                                    statusCode: 201,
                                    message: "User Already registred for the game"
                                })
                            } else {
                                Game.findOneAndUpdate({ _id: gid, users: { $elemMatch: { mobile: mob } } }, { $push: { users: userSchema } }, { new: true }).then(result => {
                                    if (result === null) {
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
                    else if (payload.length <= 2 && !isNaN(payload)) {
                        console.log("Data entery in db")
                        Game.findOne({ _id: gid, users: { $elemMatch: { mobile: req.params.mob } } }).then(user => { // if user not joined the game
                            if (user === null) {
                                return res.send({
                                    statusCode: 201,
                                    message: "First Join the game using JOIN Code"
                                })
                            }
                            if (user !== null) { // if user already in the game then save data to user object
                                Game.findOneAndUpdate({ _id: gid, users: { $elemMatch: { mobile: req.params.mob } } }, { $addToSet: { "users.$.done": payload } }, { new: true }).then(result => {
                                    if (result === null) {
                                        return res.send({
                                            statusCode: 404,
                                            message: "Game/User Not found"
                                        })
                                    }
                                    return res.send(result)
                                }).catch(error => {
                                    return res.status(500).send(error.message)
                                })
                            }
                        }).catch(error => {
                            return res.send(error.message)
                        })
                    }
                    //if TL,ML...
                    else if (payload.length == 2 && payload == "TL" || payload == "ML" || payload == "BL" || payload == "FH") {
                        console.log("Checkin for TL,ML....")
                        console.log(mob)

                        Game.findOne({ _id: gid }, { _id: 1, done: 1, topLine: 1, middleLine: 1, bottomLine: 1, fullHousie: 1, users: { $elemMatch: { mobile: req.params.mob } } }).then(user => {
                            if (user === null) {
                                return res.send("User not found")
                            }
                            else {
                                console.log(user)
                                if (payload === "TL") {
                                    let tl = user.users[0].ticket[0]
                                    if (arrCheck(user.users[0].done, tl) && arrCheck(user.done, tl)) {
                                        console.log("exists ", tl)
                                        let tlUserSchema = {
                                            name: "test",
                                            mobile: user.users[0].mobile,
                                            isWinner: false
                                        }
                                        // check already in topLine, to avoid duplicates values
                                        Game.findOne({ _id: gid, topLine: { $elemMatch: { mobile: mob } } }).then(userRes => {
                                            if (userRes === null) {
                                                console.log(user)
                                                user.topLine.push(tlUserSchema)
                                                user.save().then(tlRes => {
                                                    return res.send({
                                                        statusCode: 200,
                                                        message: "Added in Top Line"
                                                    })
                                                }).catch(tlErr => {
                                                    console.log(tlErr)
                                                    return res.send({
                                                        statusCode: 500,
                                                        error: tlErr
                                                    })
                                                })

                                            }
                                            if (userRes !== null) {
                                                return res.send("Already in TL")
                                            }
                                        }).catch(error => {
                                            return res.send(error.message)
                                        })
                                    } else {
                                        console.log("not exiosts ", tl)

                                        let wrongCount = user.users[0].wrongInput
                                        if (wrongCount < 3) {
                                            Game.findOneAndUpdate({ _id: gid, users: { $elemMatch: { mobile: mob } } }, { $set: { "users.$.wrongInput": wrongCount + 1 } }).then(user => {
                                                return res.send({
                                                    statusCode: 200,
                                                    message: `No TL Matching, you have only ${3 - (wrongCount + 1)} chance left`,
                                                })
                                            }).catch(error => {
                                                console.log(error.message)
                                                return res.status(500).send(error.message)
                                            })
                                        } else {
                                            Game.findOneAndUpdate({ _id: gid, users: { $elemMatch: { mobile: mob } } }, { $set: { "users.$.isTerminated": true } }).then(user => {
                                                return res.send({
                                                    statusCode: 200,
                                                    message: `You are terminated from this game`,
                                                })
                                            }).catch(error => {
                                                console.log(error.message)
                                                return res.status(500).send(error.message)
                                            })
                                        }


                                    }


                                }
                                else if (payload === "ML") {
                                    let ml = user.users[0].ticket[1]
                                    if (arrCheck(user.users[0].done, ml) && arrCheck(user.done, ml)) {
                                        console.log("exists ", ml)
                                        let mlUserSchema = {
                                            name: "test",
                                            mobile: user.users[0].mobile,
                                            isWinner: false
                                        }
                                        // check already in topLine, to avoid duplicates values
                                        Game.findOne({ _id: gid, middleLine: { $elemMatch: { mobile: mob } } }).then(userRes => {
                                            if (userRes === null) {
                                                console.log(user)
                                                user.middleLine.push(mlUserSchema)
                                                user.save().then(mlRes => {
                                                    return res.send({
                                                        statusCode: 200,
                                                        message: "Added in Middle Line"
                                                    })
                                                }).catch(mlErr => {
                                                    console.log(mlErr)
                                                    return res.send({
                                                        statusCode: 500,
                                                        error: mlErr
                                                    })
                                                })

                                            }
                                            if (userRes !== null) {
                                                return res.send("Already in Middle")
                                            }
                                        }).catch(error => {
                                            return res.send(error.message)
                                        })
                                    } else {
                                        console.log("not exiosts ", ml)
                                        let wrongCount = user.users[0].wrongInput
                                        if (wrongCount < 3) {
                                            Game.findOneAndUpdate({ _id: gid, users: { $elemMatch: { mobile: mob } } }, { $set: { "users.$.wrongInput": wrongCount + 1 } }).then(user => {
                                                return res.send({
                                                    statusCode: 200,
                                                    message: `No ML Matching, you have only ${3 - (wrongCount + 1)} chance left`,
                                                })
                                            }).catch(error => {
                                                console.log(error.message)
                                                return res.status(500).send(error.message)
                                            })
                                        } else {
                                            Game.findOneAndUpdate({ _id: gid, users: { $elemMatch: { mobile: mob } } }, { $set: { "users.$.isTerminated": true } }).then(user => {
                                                return res.send({
                                                    statusCode: 200,
                                                    message: `You are terminated from this game`,
                                                })
                                            }).catch(error => {
                                                console.log(error.message)
                                                return res.status(500).send(error.message)
                                            })
                                        }
                                    }

                                }
                                else if (payload === "BL") {
                                    let bl = user.users[0].ticket[2]
                                    if (arrCheck(user.users[0].done, bl) && arrCheck(user.done, bl)) {
                                        console.log("exists ", bl)
                                        let blUserSchema = {
                                            name: "test",
                                            mobile: user.users[0].mobile,
                                            isWinner: false
                                        }
                                        // check already in topLine, to avoid duplicates values
                                        Game.findOne({ _id: gid, bottomLine: { $elemMatch: { mobile: mob } } }).then(userRes => {
                                            if (userRes === null) {
                                                console.log(user)
                                                user.bottomLine.push(blUserSchema)
                                                user.save().then(blRes => {
                                                    return res.send({
                                                        statusCode: 200,
                                                        message: "Added in Bottom Line"
                                                    })
                                                }).catch(blErr => {
                                                    console.log(blErr)
                                                    return res.send({
                                                        statusCode: 500,
                                                        error: blErr
                                                    })
                                                })

                                            }
                                            if (userRes !== null) {
                                                return res.send("Already in Bottom")
                                            }
                                        }).catch(error => {
                                            return res.send(error.message)
                                        })
                                    } else {
                                        console.log("not exiosts ", bl)
                                        let wrongCount = user.users[0].wrongInput
                                        if (wrongCount < 3) {
                                            Game.findOneAndUpdate({ _id: gid, users: { $elemMatch: { mobile: mob } } }, { $set: { "users.$.wrongInput": wrongCount + 1 } }).then(user => {
                                                return res.send({
                                                    statusCode: 200,
                                                    message: `No BL Matching, you have only ${3 - (wrongCount + 1)} chance left`,
                                                })
                                            }).catch(error => {
                                                console.log(error.message)
                                                return res.status(500).send(error.message)
                                            })
                                        } else {
                                            Game.findOneAndUpdate({ _id: gid, users: { $elemMatch: { mobile: mob } } }, { $set: { "users.$.isTerminated": true } }).then(user => {
                                                return res.send({
                                                    statusCode: 200,
                                                    message: `You are terminated from this game`,
                                                })
                                            }).catch(error => {
                                                console.log(error.message)
                                                return res.status(500).send(error.message)
                                            })
                                        }
                                    }

                                }
                                else if (payload === "FH") {
                                    let fh = user.users[0].ticket
                                    if (arrCheck(user.users[0].done, fh) && arrCheck(user.done, fh)) {
                                        console.log("exists ", fh)
                                        let fhUserSchema = {
                                            name: "test",
                                            mobile: user.users[0].mobile,
                                            isWinner: false
                                        }
                                        // check already in topLine, to avoid duplicates values
                                        Game.findOne({ _id: gid, fullHousie: { $elemMatch: { mobile: mob } } }).then(userRes => {
                                            if (userRes === null) {
                                                console.log(user)
                                                user.fullHousie.push(fhUserSchema)
                                                user.save().then(fhRes => {
                                                    return res.send({
                                                        statusCode: 200,
                                                        message: "Added in Full Houie"
                                                    })
                                                }).catch(fhErr => {
                                                    console.log(fhErr)
                                                    return res.send({
                                                        statusCode: 500,
                                                        error: fhErr
                                                    })
                                                })

                                            }
                                            if (userRes !== null) {
                                                return res.send("Already in Full Housie")
                                            }
                                        }).catch(error => {
                                            return res.send(error.message)
                                        })
                                    } else {
                                        console.log("not exiosts ", fh)
                                        let wrongCount = user.users[0].wrongInput
                                        if (wrongCount < 3) {
                                            Game.findOneAndUpdate({ _id: gid, users: { $elemMatch: { mobile: mob } } }, { $set: { "users.$.wrongInput": wrongCount + 1 } }).then(user => {
                                                return res.send({
                                                    statusCode: 200,
                                                    message: `No FH Matching, you have only ${3 - (wrongCount + 1)} chance left`,
                                                })
                                            }).catch(error => {
                                                console.log(error.message)
                                                return res.status(500).send(error.message)
                                            })
                                        } else {
                                            Game.findOneAndUpdate({ _id: gid, users: { $elemMatch: { mobile: mob } } }, { $set: { "users.$.isTerminated": true } }).then(user => {
                                                return res.send({
                                                    statusCode: 200,
                                                    message: `You are terminated from this game`,
                                                })
                                            }).catch(error => {
                                                console.log(error.message)
                                                return res.status(500).send(error.message)
                                            })
                                        }
                                    }

                                }
                            }

                        })
                    }

                    else {
                        return res.send({
                            statusCode: 501,
                            message: "Not Valid Payload"
                        })
                    }

                }
            }).catch(error => {
                return res.status(500).send(error.message)
            })

        }
    }).catch(error => {
        return res.status(500).send(error.message)
    })
}


export function playGameWhatsapp(req, res) {
    console.log(req.body)
    let payload = req.body.payload.toString()
    let mob = req.body.mobile


    User.findOne({ mobile: mob }).then(user => {
        if (user === null) {
            return res.send({
                statusCode: 404,
                message: "Please Register to website First",
                link: "http://localhost:3000/registration"
            })
        } else {
            let userSchema = {
                mobile: mob,
                name: user.name,
                ticket: tambola.getTickets(1)[0]
            }
            //checks for game joining
            if (payload.length > 2) {
                if (payload.length > 2 && payload.toString().toUpperCase().includes("JOIN")) {
                    let gameName = payload.trim().replace(/  +/g, ' ').slice(5);

                    Game.findOne({ uniqueName: gameName }).then(game => {
                        // game not exists =============================
                        if (game === null) {
                            return res.send({
                                statusCode: 404,
                                message: "Game Not found"
                            })
                        } else {
                            //check is user already registered for the game
                            Game.findOne({ uniqueName: gameName, users: { $elemMatch: { mobile: mob } } }).then(user => {
                                if (user !== null) {
                                    return res.send({
                                        statusCode: 201,
                                        message: "User Already registred for the game"
                                    })
                                } else {
                                    Game.findOneAndUpdate({ uniqueName: gameName }, { $push: { users: userSchema } }, { new: true }).then(result => {
                                        // user join the game and assign ticket to users
                                        return res.send({
                                            statusCode: 200,
                                            message: `Succesfully joined the ${gameName}`,
                                            result: result
                                        })
                                    }).catch(error => {
                                        return res.status(500).send(error.message)
                                    })
                                }
                            })
                        }
                    }).catch(error => {
                        console.log("error while finding the game")
                        return res.status(500).send(error.message)
                    })

                } else {
                    return res.send({
                        statusCode: 401,
                        message: "Not Valid Payload"
                    })
                }
            }
            else if (payload.length <= 2 && !isNaN(payload)) {
                console.log("Data entery in db")
                Game.findOne({ isOnGoing: true, users: { $elemMatch: { mobile: mob } } }).then(user => {
                    // user not joined the game 
                    console.log("user", user)
                    console.log("isongoing false")
                    if (user === null) {
                        return res.send({
                            statusCode: 201,
                            message: "First Join the game using JOIN Code"
                        })
                    }
                    // if user already in the game then save data to user object
                    if (user !== null) {

                        Game.findOne({ isOnGoing: true, users: { $elemMatch: { mobile: mob, isTerminated: false } } }).then(user => {
                            console.log(user)
                            // if user is not terminated ===========
                            if (user !== null) {
                                Game.findOneAndUpdate({ isOnGoing: true, users: { $elemMatch: { mobile: mob } } }, { $addToSet: { "users.$.done": parseInt(payload) } }, { new: true }).then(result => {
                                    // number is added to user object
                                    return res.send(result)
                                }).catch(error => {
                                    return res.status(500).send(error.message)
                                })
                            }
                            // if user is terminated ============
                            else {
                                return res.send({
                                    statusCode: 401,
                                    message: "You are terminated from this on going game"
                                })
                            }
                        }).catch(error => {
                            return res.status(500).send(error.message)
                        })

                    }
                }).catch(error => {
                    return res.status(500).send(error.message)
                })
            }
            //if TL,ML...
            else if (payload.length == 2 && payload.toString().toUpperCase() == "TL" || payload.toString().toUpperCase() == "ML" || payload.toString().toUpperCase() == "BL" || payload.toString().toUpperCase() == "FH") {
                console.log("Checkin for TL,ML....")
                console.log(mob)

                Game.findOne({ isOnGoing: true }).then(game => {

                    if (game === null) {
                        return res.send({
                            statusCode: 401,
                            message: "Game is not live"
                        })
                    }

                    Game.findOne({ isOnGoing: true, users: { $elemMatch: { mobile: mob } } }).then(user => {
                        if (user === null) {
                            return res.send({
                                statusCode: 404,
                                message: "First Join the game sing JOIN code"
                            })
                        }

                        Game.findOne({ isOnGoing: true, users: { $elemMatch: { mobile: mob, isTerminated: false } } }).then(user => {
                            console.log("TL user", user)
                            // if user is not terminated ===========
                            if (user !== null) {
                                Game.findOne({ isOnGoing: true }, { _id: 1, done: 1, topLine: 1, middleLine: 1, bottomLine: 1, fullHousie: 1, users: { $elemMatch: { mobile: mob } } }).then(user => {
                                    if (user === null) {
                                        return res.send("User not found")
                                    }
                                    else {
                                        console.log(user)

                                        if (payload.toUpperCase() === "TL") {
                                            console.log("===============================")
                                            let tl = user.users[0].ticket[0]
                                            if (arrCheck(user.users[0].done, tl) && arrCheck(user.done, tl)) {
                                                console.log("===============================")
                                                console.log("exists ", tl)
                                                let tlUserSchema = {
                                                    name: user.users[0].name,
                                                    mobile: user.users[0].mobile,
                                                    isWinner: false
                                                }
                                                // check already in topLine, to avoid duplicates values
                                                Game.findOne({ isOnGoing: true, topLine: { $elemMatch: { mobile: mob } } }).then(userRes => {
                                                    if (userRes === null) {
                                                        console.log(user)
                                                        user.topLine.push(tlUserSchema)
                                                        user.save().then(tlRes => {
                                                            return res.send({
                                                                statusCode: 200,
                                                                message: "Added in Top Line"
                                                            })
                                                        }).catch(tlErr => {
                                                            console.log(tlErr)
                                                            return res.send({
                                                                statusCode: 500,
                                                                error: tlErr
                                                            })
                                                        })

                                                    }
                                                    if (userRes !== null) {
                                                        return res.send("User Already in TL")
                                                    }
                                                }).catch(error => {
                                                    return res.send(error.message)
                                                })
                                            } else {
                                                console.log("not exists ", tl)

                                                let wrongCount = user.users[0].wrongInput
                                                if (wrongCount < 3) {
                                                    Game.findOneAndUpdate({ isOnGoing: true, users: { $elemMatch: { mobile: mob } } }, { $set: { "users.$.wrongInput": wrongCount + 1 } }).then(user => {
                                                        return res.send({
                                                            statusCode: 200,
                                                            message: `No TL Matching, you have only ${3 - (wrongCount + 1)} chance left`,
                                                        })
                                                    }).catch(error => {
                                                        console.log(error.message)
                                                        return res.status(500).send(error.message)
                                                    })
                                                } else {
                                                    Game.findOneAndUpdate({ isOnGoing: true, users: { $elemMatch: { mobile: mob } } }, { $set: { "users.$.isTerminated": true } }).then(user => {
                                                        return res.send({
                                                            statusCode: 200,
                                                            message: `You are terminated from this game`,
                                                        })
                                                    }).catch(error => {
                                                        console.log(error.message)
                                                        return res.status(500).send(error.message)
                                                    })
                                                }


                                            }


                                        }
                                        else if (payload.toUpperCase() === "ML") {
                                            console.log("===============================")
                                            let ml = user.users[0].ticket[1]
                                            if (arrCheck(user.users[0].done, ml) && arrCheck(user.done, ml)) {
                                                console.log("exists ", ml)
                                                let mlUserSchema = {
                                                    name: user.users[0].name,
                                                    mobile: user.users[0].mobile,
                                                    isWinner: false
                                                }
                                                // check already in topLine, to avoid duplicates values
                                                Game.findOne({ isOnGoing: true, middleLine: { $elemMatch: { mobile: mob } } }).then(userRes => {
                                                    if (userRes === null) {
                                                        console.log(user)
                                                        user.middleLine.push(mlUserSchema)
                                                        user.save().then(mlRes => {
                                                            return res.send({
                                                                statusCode: 200,
                                                                message: "User Added in Middle Line"
                                                            })
                                                        }).catch(mlErr => {
                                                            console.log(mlErr)
                                                            return res.send({
                                                                statusCode: 500,
                                                                error: mlErr
                                                            })
                                                        })

                                                    }
                                                    if (userRes !== null) {
                                                        return res.send("User Already in Middle")
                                                    }
                                                }).catch(error => {
                                                    return res.send(error.message)
                                                })
                                            } else {
                                                console.log("not exiosts ", ml)
                                                let wrongCount = user.users[0].wrongInput
                                                if (wrongCount < 3) {
                                                    Game.findOneAndUpdate({ isOnGoing: true, users: { $elemMatch: { mobile: mob } } }, { $set: { "users.$.wrongInput": wrongCount + 1 } }).then(user => {
                                                        return res.send({
                                                            statusCode: 200,
                                                            message: `No ML Matching, you have only ${3 - (wrongCount + 1)} chance left`,
                                                        })
                                                    }).catch(error => {
                                                        console.log(error.message)
                                                        return res.status(500).send(error.message)
                                                    })
                                                } else {
                                                    Game.findOneAndUpdate({ isOnGoing: true, users: { $elemMatch: { mobile: mob } } }, { $set: { "users.$.isTerminated": true } }).then(user => {
                                                        return res.send({
                                                            statusCode: 200,
                                                            message: `You are terminated from this game`,
                                                        })
                                                    }).catch(error => {
                                                        console.log(error.message)
                                                        return res.status(500).send(error.message)
                                                    })
                                                }
                                            }

                                        }
                                        else if (payload.toUpperCase() === "BL") {
                                            let bl = user.users[0].ticket[2]
                                            if (arrCheck(user.users[0].done, bl) && arrCheck(user.done, bl)) {
                                                console.log("exists ", bl)
                                                let blUserSchema = {
                                                    name: user.users[0].name,
                                                    mobile: user.users[0].mobile,
                                                    isWinner: false
                                                }
                                                // check already in topLine, to avoid duplicates values
                                                Game.findOne({ isOnGoing: true, bottomLine: { $elemMatch: { mobile: mob } } }).then(userRes => {
                                                    if (userRes === null) {
                                                        console.log(user)
                                                        user.bottomLine.push(blUserSchema)
                                                        user.save().then(blRes => {
                                                            return res.send({
                                                                statusCode: 200,
                                                                message: "User Added in Bottom Line"
                                                            })
                                                        }).catch(blErr => {
                                                            console.log(blErr)
                                                            return res.send({
                                                                statusCode: 500,
                                                                error: blErr
                                                            })
                                                        })

                                                    }
                                                    if (userRes !== null) {
                                                        return res.send("User Already in Bottom")
                                                    }
                                                }).catch(error => {
                                                    return res.send(error.message)
                                                })
                                            } else {
                                                console.log("not exists ", bl)
                                                let wrongCount = user.users[0].wrongInput
                                                if (wrongCount < 3) {
                                                    Game.findOneAndUpdate({ isOnGoing: true, users: { $elemMatch: { mobile: mob } } }, { $set: { "users.$.wrongInput": wrongCount + 1 } }).then(user => {
                                                        return res.send({
                                                            statusCode: 200,
                                                            message: `No BL Matching, you have only ${3 - (wrongCount + 1)} chance left`,
                                                        })
                                                    }).catch(error => {
                                                        console.log(error.message)
                                                        return res.status(500).send(error.message)
                                                    })
                                                } else {
                                                    Game.findOneAndUpdate({ isOnGoing: true, users: { $elemMatch: { mobile: mob } } }, { $set: { "users.$.isTerminated": true } }).then(user => {
                                                        return res.send({
                                                            statusCode: 200,
                                                            message: `You are terminated from this game`,
                                                        })
                                                    }).catch(error => {
                                                        console.log(error.message)
                                                        return res.status(500).send(error.message)
                                                    })
                                                }
                                            }

                                        }
                                        else if (payload.toUpperCase() === "FH") {
                                            let fh = user.users[0].ticket
                                            if (arrCheck(user.users[0].done, fh) && arrCheck(user.done, fh)) {
                                                console.log("exists ", fh)
                                                let fhUserSchema = {
                                                    name: user.users[0].name,
                                                    mobile: user.users[0].mobile,
                                                    isWinner: false
                                                }
                                                // check already in topLine, to avoid duplicates values
                                                Game.findOne({ isOnGoing: true, fullHousie: { $elemMatch: { mobile: mob } } }).then(userRes => {
                                                    if (userRes === null) {
                                                        console.log(user)
                                                        user.fullHousie.push(fhUserSchema)
                                                        user.save().then(fhRes => {
                                                            return res.send({
                                                                statusCode: 200,
                                                                message: "User Added in Full Houie"
                                                            })
                                                        }).catch(fhErr => {
                                                            console.log(fhErr)
                                                            return res.send({
                                                                statusCode: 500,
                                                                error: fhErr
                                                            })
                                                        })

                                                    }
                                                    if (userRes !== null) {
                                                        return res.send("User Already in Full Housie")
                                                    }
                                                }).catch(error => {
                                                    return res.send(error.message)
                                                })
                                            } else {
                                                console.log("not exiosts ", fh)
                                                let wrongCount = user.users[0].wrongInput
                                                if (wrongCount < 3) {
                                                    Game.findOneAndUpdate({ isOnGoing: true, users: { $elemMatch: { mobile: mob } } }, { $set: { "users.$.wrongInput": wrongCount + 1 } }).then(user => {
                                                        return res.send({
                                                            statusCode: 200,
                                                            message: `No FH Matching, you have only ${3 - (wrongCount + 1)} chance left`,
                                                        })
                                                    }).catch(error => {
                                                        console.log(error.message)
                                                        return res.status(500).send(error.message)
                                                    })
                                                } else {
                                                    Game.findOneAndUpdate({ isOnGoing: true, users: { $elemMatch: { mobile: mob } } }, { $set: { "users.$.isTerminated": true } }).then(user => {
                                                        return res.send({
                                                            statusCode: 200,
                                                            message: `You are terminated from this game`,
                                                        })
                                                    }).catch(error => {
                                                        console.log(error.message)
                                                        return res.status(500).send(error.message)
                                                    })
                                                }
                                            }

                                        }
                                    }

                                })
                            }
                            // if user is terminated ============
                            else {
                                return res.send({
                                    statusCode: 401,
                                    message: "You are terminated from this on going game"
                                })
                            }
                        }).catch(error => {
                            return res.status(500).send(error.message)
                        })

                    }).catch(error => {
                        return res.status(500).send(error.message)
                    })

                }).catch(error => {
                    return res.send(error.message)
                })





            }

            else {
                return res.send({
                    statusCode: 501,
                    message: "Not Valid Payload"
                })
            }




        }
    }).catch(error => {
        return res.status(500).send(error.message)
    })
}


export function playGameWhatsapp2(req, res) {
    console.log(req.body)
    let payload = req.body.Body.payload.toString()
    let mob = req.body.Body.mobile

    const twiml = new MessagingResponse();

    try {

        User.findOne({ mobile: mob }).then(user => {
            if (user === null) {

                twiml.message("Please Register to Website first http://localhost:3000/registration")
                res.set('Content-Type', 'text/xml');
                return res.status(200).send(twiml.toString());
                // return res.send({
                //     statusCode: 404,
                //     message: "Please Register to website First",
                //     link: "http://localhost:3000/registration"
                // })
            } else {
                let userSchema = {
                    mobile: mob,
                    name: user.name,
                    ticket: tambola.getTickets(1)[0]
                }
                //checks for game joining
                if (payload.length > 2) {
                    if (payload.length > 2 && payload.toString().toUpperCase().includes("JOIN")) {
                        let gameName = payload.trim().replace(/  +/g, ' ').slice(5);

                        Game.findOne({ uniqueName: gameName }).then(game => {
                            // game not exists =============================
                            if (game === null) {
                                twiml.message("Game Not found")
                                res.set('Content-Type', 'text/xml');
                                return res.status(200).send(twiml.toString());
                                // return res.send({
                                //     statusCode: 404,
                                //     message: "Game Not found"
                                // })
                            } else {
                                //check is user already registered for the game
                                Game.findOne({ uniqueName: gameName, users: { $elemMatch: { mobile: mob } } }).then(user => {
                                    if (user !== null) {
                                        twiml.message("User Already registred for the game")
                                        res.set('Content-Type', 'text/xml');
                                        return res.status(200).send(twiml.toString());
                                        // return res.send({
                                        //     statusCode: 201,
                                        //     message: "User Already registred for the game"
                                        // })
                                    } else {
                                        Game.findOneAndUpdate({ uniqueName: gameName }, { $push: { users: userSchema } }, { new: true }).then(result => {
                                            // user join the game and assign ticket to users
                                            twiml.message(`Succesfully joined the ${gameName}`)
                                            res.set('Content-Type', 'text/xml');
                                            return res.status(200).send(twiml.toString());
                                            // return res.send({
                                            //     statusCode: 200,
                                            //     message: `Succesfully joined the ${gameName}`,
                                            //     result: result
                                            // })
                                        }).catch(error => {
                                            return res.status(500).send(error.message)
                                        })
                                    }
                                })
                            }
                        }).catch(error => {
                            console.log("error while finding the game")
                            return res.status(500).send(error.message)
                        })

                    } else {
                        twiml.message(`Please Input Valid Payload`)
                        res.set('Content-Type', 'text/xml');
                        return res.status(200).send(twiml.toString());
                        // return res.send({
                        //     statusCode: 401,
                        //     message: "Not Valid Payload"
                        // })
                    }
                }
                else if (payload.length <= 2 && !isNaN(payload)) {
                    console.log("Data entery in db")
                    Game.findOne({ isOnGoing: true, users: { $elemMatch: { mobile: mob } } }).then(user => {
                        // user not joined the game 
                        console.log("user", user)
                        console.log("isongoing false")
                        if (user === null) {
                            twiml.message(`First Join the game using JOIN Code`)
                            res.set('Content-Type', 'text/xml');
                            return res.status(200).send(twiml.toString());
                            // return res.send({
                            //     statusCode: 201,
                            //     message: "First Join the game using JOIN Code"
                            // })
                        }
                        // if user already in the game then save data to user object
                        if (user !== null) {

                            Game.findOne({ isOnGoing: true, users: { $elemMatch: { mobile: mob, isTerminated: false } } }).then(user => {
                                console.log(user)
                                // if user is not terminated ===========
                                if (user !== null) {
                                    Game.findOneAndUpdate({ isOnGoing: true, users: { $elemMatch: { mobile: mob } } }, { $addToSet: { "users.$.done": parseInt(payload) } }, { new: true }).then(result => {
                                        // number is added to user object
                                        twiml.message(`You Entered ${payload}`)
                                        res.set('Content-Type', 'text/xml');
                                        return res.status(200).send(twiml.toString());
                                        // return res.send(result)
                                    }).catch(error => {
                                        return res.status(500).send(error.message)
                                    })
                                }
                                // if user is terminated ============
                                else {
                                    twiml.message(`You are terminated from this on going game`)
                                    res.set('Content-Type', 'text/xml');
                                    return res.status(200).send(twiml.toString());
                                    // return res.send({
                                    //     statusCode: 401,
                                    //     message: "You are terminated from this on going game"
                                    // })
                                }
                            }).catch(error => {
                                return res.status(500).send(error.message)
                            })

                        }
                    }).catch(error => {
                        return res.status(500).send(error.message)
                    })
                }
                //if TL,ML...
                else if (payload.length == 2 && payload.toString().toUpperCase() == "TL" || payload.toString().toUpperCase() == "ML" || payload.toString().toUpperCase() == "BL" || payload.toString().toUpperCase() == "FH") {
                    console.log("Checkin for TL,ML....")
                    console.log(mob)

                    Game.findOne({ isOnGoing: true }).then(game => {

                        if (game === null) {
                            twiml.message(`Game is not live`)
                            res.set('Content-Type', 'text/xml');
                            return res.status(200).send(twiml.toString());
                            // return res.send({
                            //     statusCode: 401,
                            //     message: "Game is not live"
                            // })
                        }

                        Game.findOne({ isOnGoing: true, users: { $elemMatch: { mobile: mob } } }).then(user => {
                            if (user === null) {
                                twiml.message(`First Join the game sing JOIN code`)
                                res.set('Content-Type', 'text/xml');
                                return res.status(200).send(twiml.toString());
                                // return res.send({
                                //     statusCode: 404,
                                //     message: "First Join the game sing JOIN code"
                                // })
                            }

                            Game.findOne({ isOnGoing: true, users: { $elemMatch: { mobile: mob, isTerminated: false } } }).then(user => {
                                console.log("TL user", user)
                                // if user is not terminated ===========
                                if (user !== null) {
                                    Game.findOne({ isOnGoing: true }, { _id: 1, done: 1, topLine: 1, middleLine: 1, bottomLine: 1, fullHousie: 1, users: { $elemMatch: { mobile: mob } } }).then(user => {
                                        if (user === null) {
                                            twiml.message(`First Join the game sing JOIN code`)
                                            res.set('Content-Type', 'text/xml');
                                            return res.status(200).send(twiml.toString());
                                            // return res.send("User not found")
                                        }
                                        else {
                                            console.log(user)

                                            if (payload.toUpperCase() === "TL") {
                                                console.log("===============================")
                                                let tl = user.users[0].ticket[0]
                                                if (arrCheck(user.users[0].done, tl) && arrCheck(user.done, tl)) {
                                                    console.log("===============================")
                                                    console.log("exists ", tl)
                                                    let tlUserSchema = {
                                                        name: user.users[0].name,
                                                        mobile: user.users[0].mobile,
                                                        isWinner: false
                                                    }
                                                    // check already in topLine, to avoid duplicates values
                                                    Game.findOne({ isOnGoing: true, topLine: { $elemMatch: { mobile: mob } } }).then(userRes => {
                                                        if (userRes === null) {
                                                            console.log(user)
                                                            user.topLine.push(tlUserSchema)
                                                            user.save().then(tlRes => {
                                                                twiml.message(`Congratulation, You have completed your TOP LINE`)
                                                                res.set('Content-Type', 'text/xml');
                                                                return res.status(200).send(twiml.toString());
                                                                // return res.send({
                                                                //     statusCode: 200,
                                                                //     message: "Added in Top Line"
                                                                // })
                                                            }).catch(tlErr => {
                                                                console.log(tlErr)
                                                                return res.send({
                                                                    statusCode: 500,
                                                                    error: tlErr
                                                                })
                                                            })

                                                        }
                                                        if (userRes !== null) {
                                                            twiml.message(`You Have already completed youe TOP LINE`)
                                                            res.set('Content-Type', 'text/xml');
                                                            return res.status(200).send(twiml.toString());
                                                            // return res.send("User Already in TL")
                                                        }
                                                    }).catch(error => {
                                                        return res.send(error.message)
                                                    })
                                                } else {
                                                    console.log("not exists ", tl)

                                                    let wrongCount = user.users[0].wrongInput
                                                    if (wrongCount < 3) {
                                                        Game.findOneAndUpdate({ isOnGoing: true, users: { $elemMatch: { mobile: mob } } }, { $set: { "users.$.wrongInput": wrongCount + 1 } }).then(user => {
                                                            twiml.message(`No TL Matching, you have only ${3 - (wrongCount + 1)} chance left`)
                                                            res.set('Content-Type', 'text/xml');
                                                            return res.status(200).send(twiml.toString());
                                                            // return res.send({
                                                            //     statusCode: 200,
                                                            //     message: `No TL Matching, you have only ${3 - (wrongCount + 1)} chance left`,
                                                            // })
                                                        }).catch(error => {
                                                            console.log(error.message)
                                                            return res.status(500).send(error.message)
                                                        })
                                                    } else {
                                                        Game.findOneAndUpdate({ isOnGoing: true, users: { $elemMatch: { mobile: mob } } }, { $set: { "users.$.isTerminated": true } }).then(user => {
                                                            twiml.message(`You are terminated from this game`)
                                                            res.set('Content-Type', 'text/xml');
                                                            return res.status(200).send(twiml.toString());
                                                            // return res.send({
                                                            //     statusCode: 200,
                                                            //     message: `You are terminated from this game`,
                                                            // })
                                                        }).catch(error => {
                                                            console.log(error.message)
                                                            return res.status(500).send(error.message)
                                                        })
                                                    }


                                                }


                                            }
                                            else if (payload.toUpperCase() === "ML") {
                                                console.log("===============================")
                                                let ml = user.users[0].ticket[1]
                                                if (arrCheck(user.users[0].done, ml) && arrCheck(user.done, ml)) {
                                                    console.log("exists ", ml)
                                                    let mlUserSchema = {
                                                        name: user.users[0].name,
                                                        mobile: user.users[0].mobile,
                                                        isWinner: false
                                                    }
                                                    // check already in topLine, to avoid duplicates values
                                                    Game.findOne({ isOnGoing: true, middleLine: { $elemMatch: { mobile: mob } } }).then(userRes => {
                                                        if (userRes === null) {
                                                            console.log(user)
                                                            user.middleLine.push(mlUserSchema)
                                                            user.save().then(mlRes => {
                                                                twiml.message(`Congratulation, You have completed your MIDDLE LINE`)
                                                                res.set('Content-Type', 'text/xml');
                                                                return res.status(200).send(twiml.toString());
                                                                // return res.send({
                                                                //     statusCode: 200,
                                                                //     message: "User Added in Middle Line"
                                                                // })
                                                            }).catch(mlErr => {
                                                                console.log(mlErr)
                                                                return res.send({
                                                                    statusCode: 500,
                                                                    error: mlErr
                                                                })
                                                            })

                                                        }
                                                        if (userRes !== null) {
                                                            twiml.message(`You Have already completed your MIDDLE LINE`)
                                                            res.set('Content-Type', 'text/xml');
                                                            return res.status(200).send(twiml.toString());
                                                            // return res.send("User Already in Middle")
                                                        }
                                                    }).catch(error => {
                                                        return res.send(error.message)
                                                    })
                                                } else {
                                                    console.log("not exiosts ", ml)
                                                    let wrongCount = user.users[0].wrongInput
                                                    if (wrongCount < 3) {
                                                        Game.findOneAndUpdate({ isOnGoing: true, users: { $elemMatch: { mobile: mob } } }, { $set: { "users.$.wrongInput": wrongCount + 1 } }).then(user => {
                                                            twiml.message(`No ML Matching, you have only ${3 - (wrongCount + 1)} chance left`)
                                                            res.set('Content-Type', 'text/xml');
                                                            return res.status(200).send(twiml.toString());
                                                            // return res.send({
                                                            //     statusCode: 200,
                                                            //     message: `No ML Matching, you have only ${3 - (wrongCount + 1)} chance left`,
                                                            // })
                                                        }).catch(error => {
                                                            console.log(error.message)
                                                            return res.status(500).send(error.message)
                                                        })
                                                    } else {
                                                        Game.findOneAndUpdate({ isOnGoing: true, users: { $elemMatch: { mobile: mob } } }, { $set: { "users.$.isTerminated": true } }).then(user => {
                                                            twiml.message(`You are terminated from this game`)
                                                            res.set('Content-Type', 'text/xml');
                                                            return res.status(200).send(twiml.toString());
                                                            // return res.send({
                                                            //     statusCode: 200,
                                                            //     message: `You are terminated from this game`,
                                                            // })
                                                        }).catch(error => {
                                                            console.log(error.message)
                                                            return res.status(500).send(error.message)
                                                        })
                                                    }
                                                }

                                            }
                                            else if (payload.toUpperCase() === "BL") {
                                                let bl = user.users[0].ticket[2]
                                                if (arrCheck(user.users[0].done, bl) && arrCheck(user.done, bl)) {
                                                    console.log("exists ", bl)
                                                    let blUserSchema = {
                                                        name: user.users[0].name,
                                                        mobile: user.users[0].mobile,
                                                        isWinner: false
                                                    }
                                                    // check already in topLine, to avoid duplicates values
                                                    Game.findOne({ isOnGoing: true, bottomLine: { $elemMatch: { mobile: mob } } }).then(userRes => {
                                                        if (userRes === null) {
                                                            console.log(user)
                                                            user.bottomLine.push(blUserSchema)
                                                            user.save().then(blRes => {
                                                                twiml.message(`Congratulation, You have completed your BOTTOM LINE`)
                                                                res.set('Content-Type', 'text/xml');
                                                                return res.status(200).send(twiml.toString());
                                                                // return res.send({
                                                                //     statusCode: 200,
                                                                //     message: "User Added in Bottom Line"
                                                                // })
                                                            }).catch(blErr => {
                                                                console.log(blErr)
                                                                return res.send({
                                                                    statusCode: 500,
                                                                    error: blErr
                                                                })
                                                            })

                                                        }
                                                        if (userRes !== null) {
                                                            twiml.message(`You Have already completed your BOTTOM LINE`)
                                                            res.set('Content-Type', 'text/xml');
                                                            return res.status(200).send(twiml.toString());
                                                            // return res.send("User Already in Bottom")
                                                        }
                                                    }).catch(error => {
                                                        return res.send(error.message)
                                                    })
                                                } else {
                                                    console.log("not exists ", bl)
                                                    let wrongCount = user.users[0].wrongInput
                                                    if (wrongCount < 3) {
                                                        Game.findOneAndUpdate({ isOnGoing: true, users: { $elemMatch: { mobile: mob } } }, { $set: { "users.$.wrongInput": wrongCount + 1 } }).then(user => {
                                                            twiml.message(`No BL Matching, you have only ${3 - (wrongCount + 1)} chance left`)
                                                            res.set('Content-Type', 'text/xml');
                                                            return res.status(200).send(twiml.toString());
                                                            // return res.send({
                                                            //     statusCode: 200,
                                                            //     message: `No BL Matching, you have only ${3 - (wrongCount + 1)} chance left`,
                                                            // })
                                                        }).catch(error => {
                                                            console.log(error.message)
                                                            return res.status(500).send(error.message)
                                                        })
                                                    } else {
                                                        Game.findOneAndUpdate({ isOnGoing: true, users: { $elemMatch: { mobile: mob } } }, { $set: { "users.$.isTerminated": true } }).then(user => {
                                                            twiml.message(`You are terminated from this game`)
                                                            res.set('Content-Type', 'text/xml');
                                                            return res.status(200).send(twiml.toString());
                                                            // return res.send({
                                                            //     statusCode: 200,
                                                            //     message: `You are terminated from this game`,
                                                            // })
                                                        }).catch(error => {
                                                            console.log(error.message)
                                                            return res.status(500).send(error.message)
                                                        })
                                                    }
                                                }

                                            }
                                            else if (payload.toUpperCase() === "FH") {
                                                let fh = user.users[0].ticket
                                                if (arrCheck(user.users[0].done, fh) && arrCheck(user.done, fh)) {
                                                    console.log("exists ", fh)
                                                    let fhUserSchema = {
                                                        name: user.users[0].name,
                                                        mobile: user.users[0].mobile,
                                                        isWinner: false
                                                    }
                                                    // check already in topLine, to avoid duplicates values
                                                    Game.findOne({ isOnGoing: true, fullHousie: { $elemMatch: { mobile: mob } } }).then(userRes => {
                                                        if (userRes === null) {
                                                            console.log(user)
                                                            user.fullHousie.push(fhUserSchema)
                                                            user.save().then(fhRes => {
                                                                twiml.message(`Congratulation, You have completed your FULL HOUSIE`)
                                                                res.set('Content-Type', 'text/xml');
                                                                return res.status(200).send(twiml.toString());
                                                                // return res.send({
                                                                //     statusCode: 200,
                                                                //     message: "User Added in Full Houie"
                                                                // })
                                                            }).catch(fhErr => {
                                                                console.log(fhErr)
                                                                return res.send({
                                                                    statusCode: 500,
                                                                    error: fhErr
                                                                })
                                                            })

                                                        }
                                                        if (userRes !== null) {
                                                            twiml.message(`You Have already completed your FULL HOUSIEE`)
                                                            res.set('Content-Type', 'text/xml');
                                                            return res.status(200).send(twiml.toString());
                                                            // return res.send("User Already in Full Housie")
                                                        }
                                                    }).catch(error => {
                                                        return res.send(error.message)
                                                    })
                                                } else {
                                                    console.log("not exiosts ", fh)
                                                    let wrongCount = user.users[0].wrongInput
                                                    if (wrongCount < 3) {
                                                        Game.findOneAndUpdate({ isOnGoing: true, users: { $elemMatch: { mobile: mob } } }, { $set: { "users.$.wrongInput": wrongCount + 1 } }).then(user => {
                                                            twiml.message(`No FH Matching, you have only ${3 - (wrongCount + 1)} chance left`)
                                                            res.set('Content-Type', 'text/xml');
                                                            return res.status(200).send(twiml.toString());
                                                            // return res.send({
                                                            //     statusCode: 200,
                                                            //     message: `No FH Matching, you have only ${3 - (wrongCount + 1)} chance left`,
                                                            // })
                                                        }).catch(error => {
                                                            console.log(error.message)
                                                            return res.status(500).send(error.message)
                                                        })
                                                    } else {
                                                        Game.findOneAndUpdate({ isOnGoing: true, users: { $elemMatch: { mobile: mob } } }, { $set: { "users.$.isTerminated": true } }).then(user => {
                                                            twiml.message(`You are terminated from this game`)
                                                            res.set('Content-Type', 'text/xml');
                                                            return res.status(200).send(twiml.toString());
                                                            // return res.send({
                                                            //     statusCode: 200,
                                                            //     message: `You are terminated from this game`,
                                                            // })
                                                        }).catch(error => {
                                                            console.log(error.message)
                                                            return res.status(500).send(error.message)
                                                        })
                                                    }
                                                }

                                            }
                                        }

                                    })
                                }
                                // if user is terminated ============
                                else {
                                    twiml.message(`You are terminated from this on going game`)
                                    res.set('Content-Type', 'text/xml');
                                    return res.status(200).send(twiml.toString());
                                    // return res.send({
                                    //     statusCode: 401,
                                    //     message: "You are terminated from this on going game"
                                    // })
                                }
                            }).catch(error => {
                                return res.status(500).send(error.message)
                            })

                        }).catch(error => {
                            return res.status(500).send(error.message)
                        })

                    }).catch(error => {
                        return res.send(error.message)
                    })





                }

                else {
                    return res.send({
                        statusCode: 501,
                        message: "Not Valid Payload"
                    })
                }




            }
        }).catch(error => {
            return res.status(500).send(error.message)
        })

    } catch (error) {
        return res.send(error)
    }
}

export function playGameWhatsappClient(req, res) {
    console.log(req.body)
    let payload = req.body.Body.payload.toString()
    let mob = req.body.Body.mobile

    const twiml = new MessagingResponse();

    try {

        User.findOne({ mobile: mob }).then(user => {
            if (user === null) {

                twiml.message("Please Register to Website first http://localhost:3000/registration")
                res.set('Content-Type', 'text/xml');
                return res.status(200).send(twiml.toString());
                // return res.send({
                //     statusCode: 404,
                //     message: "Please Register to website First",
                //     link: "http://localhost:3000/registration"
                // })
            } else {
                let userSchema = {
                    mobile: mob,
                    name: user.name,
                    ticket: tambola.getTickets(1)[0]
                }
                //checks for game joining
                if (payload.length > 2) {
                    if (payload.length > 2 && payload.toString().toUpperCase().includes("JOIN")) {
                        let gameName = payload.trim().replace(/  +/g, ' ').slice(5);

                        Game.findOne({ uniqueName: gameName }).then(game => {
                            // game not exists =============================
                            if (game === null) {
                                twiml.message("Game Not found")
                                res.set('Content-Type', 'text/xml');
                                return res.status(200).send(twiml.toString());
                                // return res.send({
                                //     statusCode: 404,
                                //     message: "Game Not found"
                                // })
                            } else {
                                //check is user already registered for the game
                                Game.findOne({ uniqueName: gameName, users: { $elemMatch: { mobile: mob } } }).then(user => {
                                    if (user !== null) {
                                        twiml.message("User Already registred for the game")
                                        res.set('Content-Type', 'text/xml');
                                        return res.status(200).send(twiml.toString());
                                        // return res.send({
                                        //     statusCode: 201,
                                        //     message: "User Already registred for the game"
                                        // })
                                    } else {
                                        Game.findOneAndUpdate({ uniqueName: gameName }, { $push: { users: userSchema } }, { new: true }).then(result => {
                                            // user join the game and assign ticket to users
                                            twiml.message(`Succesfully joined the ${gameName}`)
                                            res.set('Content-Type', 'text/xml');
                                            return res.status(200).send(twiml.toString());
                                            // return res.send({
                                            //     statusCode: 200,
                                            //     message: `Succesfully joined the ${gameName}`,
                                            //     result: result
                                            // })
                                        }).catch(error => {
                                            return res.status(500).send(error.message)
                                        })
                                    }
                                })
                            }
                        }).catch(error => {
                            console.log("error while finding the game")
                            return res.status(500).send(error.message)
                        })

                    } else {
                        twiml.message(`Please Input Valid Payload`)
                        res.set('Content-Type', 'text/xml');
                        return res.status(200).send(twiml.toString());
                        // return res.send({
                        //     statusCode: 401,
                        //     message: "Not Valid Payload"
                        // })
                    }
                }
                else if (payload.length <= 2 && !isNaN(payload)) {
                    console.log("Data entery in db")
                    Game.findOne({ isOnGoing: true, users: { $elemMatch: { mobile: mob } } }).then(user => {
                        // user not joined the game 
                        console.log("user", user)
                        console.log("isongoing false")
                        if (user === null) {
                            twiml.message(`First Join the game using JOIN Code`)
                            res.set('Content-Type', 'text/xml');
                            return res.status(200).send(twiml.toString());
                            // return res.send({
                            //     statusCode: 201,
                            //     message: "First Join the game using JOIN Code"
                            // })
                        }
                        // if user already in the game then save data to user object
                        if (user !== null) {

                            Game.findOne({ isOnGoing: true, users: { $elemMatch: { mobile: mob, isTerminated: false } } }).then(user => {
                                console.log(user)
                                // if user is not terminated ===========
                                if (user !== null) {
                                    Game.findOneAndUpdate({ isOnGoing: true, users: { $elemMatch: { mobile: mob } } }, { $addToSet: { "users.$.done": parseInt(payload) } }, { new: true }).then(result => {
                                        // number is added to user object
                                        twiml.message(`You Entered ${payload}`)
                                        res.set('Content-Type', 'text/xml');
                                        return res.status(200).send(twiml.toString());
                                        // return res.send(result)
                                    }).catch(error => {
                                        return res.status(500).send(error.message)
                                    })
                                }
                                // if user is terminated ============
                                else {
                                    twiml.message(`You are terminated from this on going game`)
                                    res.set('Content-Type', 'text/xml');
                                    return res.status(200).send(twiml.toString());
                                    // return res.send({
                                    //     statusCode: 401,
                                    //     message: "You are terminated from this on going game"
                                    // })
                                }
                            }).catch(error => {
                                return res.status(500).send(error.message)
                            })

                        }
                    }).catch(error => {
                        return res.status(500).send(error.message)
                    })
                }
                //if TL,ML...
                else if (payload.length == 2 && payload.toString().toUpperCase() == "TL" || payload.toString().toUpperCase() == "ML" || payload.toString().toUpperCase() == "BL" || payload.toString().toUpperCase() == "FH") {
                    console.log("Checkin for TL,ML....")
                    console.log(mob)

                    Game.findOne({ isOnGoing: true }).then(game => {

                        if (game === null) {
                            twiml.message(`Game is not live`)
                            res.set('Content-Type', 'text/xml');
                            return res.status(200).send(twiml.toString());
                            // return res.send({
                            //     statusCode: 401,
                            //     message: "Game is not live"
                            // })
                        }

                        Game.findOne({ isOnGoing: true, users: { $elemMatch: { mobile: mob } } }).then(user => {
                            if (user === null) {
                                twiml.message(`First Join the game sing JOIN code`)
                                res.set('Content-Type', 'text/xml');
                                return res.status(200).send(twiml.toString());
                                // return res.send({
                                //     statusCode: 404,
                                //     message: "First Join the game sing JOIN code"
                                // })
                            }

                            Game.findOne({ isOnGoing: true, users: { $elemMatch: { mobile: mob, isTerminated: false } } }).then(user => {
                                console.log("TL user", user)
                                // if user is not terminated ===========
                                if (user !== null) {
                                    Game.findOne({ isOnGoing: true }, { _id: 1, done: 1, topLine: 1, middleLine: 1, bottomLine: 1, fullHousie: 1, users: { $elemMatch: { mobile: mob } } }).then(user => {
                                        if (user === null) {
                                            twiml.message(`First Join the game sing JOIN code`)
                                            res.set('Content-Type', 'text/xml');
                                            return res.status(200).send(twiml.toString());
                                            // return res.send("User not found")
                                        }
                                        else {
                                            console.log(user)

                                            if (payload.toUpperCase() === "TL") {
                                                console.log("===============================")
                                                let tl = user.users[0].ticket[0]
                                                if (arrCheck(user.users[0].done, tl) && arrCheck(user.done, tl)) {
                                                    console.log("===============================")
                                                    console.log("exists ", tl)
                                                    let tlUserSchema = {
                                                        name: user.users[0].name,
                                                        mobile: user.users[0].mobile,
                                                        isWinner: false
                                                    }
                                                    // check already in topLine, to avoid duplicates values
                                                    Game.findOne({ isOnGoing: true, topLine: { $elemMatch: { mobile: mob } } }).then(userRes => {
                                                        if (userRes === null) {
                                                            console.log(user)
                                                            user.topLine.push(tlUserSchema)
                                                            user.save().then(tlRes => {
                                                                twiml.message(`Congratulation, You have completed your TOP LINE`)
                                                                res.set('Content-Type', 'text/xml');
                                                                return res.status(200).send(twiml.toString());
                                                                // return res.send({
                                                                //     statusCode: 200,
                                                                //     message: "Added in Top Line"
                                                                // })
                                                            }).catch(tlErr => {
                                                                console.log(tlErr)
                                                                return res.send({
                                                                    statusCode: 500,
                                                                    error: tlErr
                                                                })
                                                            })

                                                        }
                                                        if (userRes !== null) {
                                                            twiml.message(`You Have already completed youe TOP LINE`)
                                                            res.set('Content-Type', 'text/xml');
                                                            return res.status(200).send(twiml.toString());
                                                            // return res.send("User Already in TL")
                                                        }
                                                    }).catch(error => {
                                                        return res.send(error.message)
                                                    })
                                                } else {
                                                    console.log("not exists ", tl)

                                                    let wrongCount = user.users[0].wrongInput
                                                    if (wrongCount < 3) {
                                                        Game.findOneAndUpdate({ isOnGoing: true, users: { $elemMatch: { mobile: mob } } }, { $set: { "users.$.wrongInput": wrongCount + 1 } }).then(user => {
                                                            twiml.message(`No TL Matching, you have only ${3 - (wrongCount + 1)} chance left`)
                                                            res.set('Content-Type', 'text/xml');
                                                            return res.status(200).send(twiml.toString());
                                                            // return res.send({
                                                            //     statusCode: 200,
                                                            //     message: `No TL Matching, you have only ${3 - (wrongCount + 1)} chance left`,
                                                            // })
                                                        }).catch(error => {
                                                            console.log(error.message)
                                                            return res.status(500).send(error.message)
                                                        })
                                                    } else {
                                                        Game.findOneAndUpdate({ isOnGoing: true, users: { $elemMatch: { mobile: mob } } }, { $set: { "users.$.isTerminated": true } }).then(user => {
                                                            twiml.message(`You are terminated from this game`)
                                                            res.set('Content-Type', 'text/xml');
                                                            return res.status(200).send(twiml.toString());
                                                            // return res.send({
                                                            //     statusCode: 200,
                                                            //     message: `You are terminated from this game`,
                                                            // })
                                                        }).catch(error => {
                                                            console.log(error.message)
                                                            return res.status(500).send(error.message)
                                                        })
                                                    }


                                                }


                                            }
                                            else if (payload.toUpperCase() === "ML") {
                                                console.log("===============================")
                                                let ml = user.users[0].ticket[1]
                                                if (arrCheck(user.users[0].done, ml) && arrCheck(user.done, ml)) {
                                                    console.log("exists ", ml)
                                                    let mlUserSchema = {
                                                        name: user.users[0].name,
                                                        mobile: user.users[0].mobile,
                                                        isWinner: false
                                                    }
                                                    // check already in topLine, to avoid duplicates values
                                                    Game.findOne({ isOnGoing: true, middleLine: { $elemMatch: { mobile: mob } } }).then(userRes => {
                                                        if (userRes === null) {
                                                            console.log(user)
                                                            user.middleLine.push(mlUserSchema)
                                                            user.save().then(mlRes => {
                                                                twiml.message(`Congratulation, You have completed your MIDDLE LINE`)
                                                                res.set('Content-Type', 'text/xml');
                                                                return res.status(200).send(twiml.toString());
                                                                // return res.send({
                                                                //     statusCode: 200,
                                                                //     message: "User Added in Middle Line"
                                                                // })
                                                            }).catch(mlErr => {
                                                                console.log(mlErr)
                                                                return res.send({
                                                                    statusCode: 500,
                                                                    error: mlErr
                                                                })
                                                            })

                                                        }
                                                        if (userRes !== null) {
                                                            twiml.message(`You Have already completed your MIDDLE LINE`)
                                                            res.set('Content-Type', 'text/xml');
                                                            return res.status(200).send(twiml.toString());
                                                            // return res.send("User Already in Middle")
                                                        }
                                                    }).catch(error => {
                                                        return res.send(error.message)
                                                    })
                                                } else {
                                                    console.log("not exiosts ", ml)
                                                    let wrongCount = user.users[0].wrongInput
                                                    if (wrongCount < 3) {
                                                        Game.findOneAndUpdate({ isOnGoing: true, users: { $elemMatch: { mobile: mob } } }, { $set: { "users.$.wrongInput": wrongCount + 1 } }).then(user => {
                                                            twiml.message(`No ML Matching, you have only ${3 - (wrongCount + 1)} chance left`)
                                                            res.set('Content-Type', 'text/xml');
                                                            return res.status(200).send(twiml.toString());
                                                            // return res.send({
                                                            //     statusCode: 200,
                                                            //     message: `No ML Matching, you have only ${3 - (wrongCount + 1)} chance left`,
                                                            // })
                                                        }).catch(error => {
                                                            console.log(error.message)
                                                            return res.status(500).send(error.message)
                                                        })
                                                    } else {
                                                        Game.findOneAndUpdate({ isOnGoing: true, users: { $elemMatch: { mobile: mob } } }, { $set: { "users.$.isTerminated": true } }).then(user => {
                                                            twiml.message(`You are terminated from this game`)
                                                            res.set('Content-Type', 'text/xml');
                                                            return res.status(200).send(twiml.toString());
                                                            // return res.send({
                                                            //     statusCode: 200,
                                                            //     message: `You are terminated from this game`,
                                                            // })
                                                        }).catch(error => {
                                                            console.log(error.message)
                                                            return res.status(500).send(error.message)
                                                        })
                                                    }
                                                }

                                            }
                                            else if (payload.toUpperCase() === "BL") {
                                                let bl = user.users[0].ticket[2]
                                                if (arrCheck(user.users[0].done, bl) && arrCheck(user.done, bl)) {
                                                    console.log("exists ", bl)
                                                    let blUserSchema = {
                                                        name: user.users[0].name,
                                                        mobile: user.users[0].mobile,
                                                        isWinner: false
                                                    }
                                                    // check already in topLine, to avoid duplicates values
                                                    Game.findOne({ isOnGoing: true, bottomLine: { $elemMatch: { mobile: mob } } }).then(userRes => {
                                                        if (userRes === null) {
                                                            console.log(user)
                                                            user.bottomLine.push(blUserSchema)
                                                            user.save().then(blRes => {
                                                                twiml.message(`Congratulation, You have completed your BOTTOM LINE`)
                                                                res.set('Content-Type', 'text/xml');
                                                                return res.status(200).send(twiml.toString());
                                                                // return res.send({
                                                                //     statusCode: 200,
                                                                //     message: "User Added in Bottom Line"
                                                                // })
                                                            }).catch(blErr => {
                                                                console.log(blErr)
                                                                return res.send({
                                                                    statusCode: 500,
                                                                    error: blErr
                                                                })
                                                            })

                                                        }
                                                        if (userRes !== null) {
                                                            twiml.message(`You Have already completed your BOTTOM LINE`)
                                                            res.set('Content-Type', 'text/xml');
                                                            return res.status(200).send(twiml.toString());
                                                            // return res.send("User Already in Bottom")
                                                        }
                                                    }).catch(error => {
                                                        return res.send(error.message)
                                                    })
                                                } else {
                                                    console.log("not exists ", bl)
                                                    let wrongCount = user.users[0].wrongInput
                                                    if (wrongCount < 3) {
                                                        Game.findOneAndUpdate({ isOnGoing: true, users: { $elemMatch: { mobile: mob } } }, { $set: { "users.$.wrongInput": wrongCount + 1 } }).then(user => {
                                                            twiml.message(`No BL Matching, you have only ${3 - (wrongCount + 1)} chance left`)
                                                            res.set('Content-Type', 'text/xml');
                                                            return res.status(200).send(twiml.toString());
                                                            // return res.send({
                                                            //     statusCode: 200,
                                                            //     message: `No BL Matching, you have only ${3 - (wrongCount + 1)} chance left`,
                                                            // })
                                                        }).catch(error => {
                                                            console.log(error.message)
                                                            return res.status(500).send(error.message)
                                                        })
                                                    } else {
                                                        Game.findOneAndUpdate({ isOnGoing: true, users: { $elemMatch: { mobile: mob } } }, { $set: { "users.$.isTerminated": true } }).then(user => {
                                                            twiml.message(`You are terminated from this game`)
                                                            res.set('Content-Type', 'text/xml');
                                                            return res.status(200).send(twiml.toString());
                                                            // return res.send({
                                                            //     statusCode: 200,
                                                            //     message: `You are terminated from this game`,
                                                            // })
                                                        }).catch(error => {
                                                            console.log(error.message)
                                                            return res.status(500).send(error.message)
                                                        })
                                                    }
                                                }

                                            }
                                            else if (payload.toUpperCase() === "FH") {
                                                let fh = user.users[0].ticket
                                                if (arrCheck(user.users[0].done, fh) && arrCheck(user.done, fh)) {
                                                    console.log("exists ", fh)
                                                    let fhUserSchema = {
                                                        name: user.users[0].name,
                                                        mobile: user.users[0].mobile,
                                                        isWinner: false
                                                    }
                                                    // check already in topLine, to avoid duplicates values
                                                    Game.findOne({ isOnGoing: true, fullHousie: { $elemMatch: { mobile: mob } } }).then(userRes => {
                                                        if (userRes === null) {
                                                            console.log(user)
                                                            user.fullHousie.push(fhUserSchema)
                                                            user.save().then(fhRes => {
                                                                twiml.message(`Congratulation, You have completed your FULL HOUSIE`)
                                                                res.set('Content-Type', 'text/xml');
                                                                return res.status(200).send(twiml.toString());
                                                                // return res.send({
                                                                //     statusCode: 200,
                                                                //     message: "User Added in Full Houie"
                                                                // })
                                                            }).catch(fhErr => {
                                                                console.log(fhErr)
                                                                return res.send({
                                                                    statusCode: 500,
                                                                    error: fhErr
                                                                })
                                                            })

                                                        }
                                                        if (userRes !== null) {
                                                            twiml.message(`You Have already completed your FULL HOUSIEE`)
                                                            res.set('Content-Type', 'text/xml');
                                                            return res.status(200).send(twiml.toString());
                                                            // return res.send("User Already in Full Housie")
                                                        }
                                                    }).catch(error => {
                                                        return res.send(error.message)
                                                    })
                                                } else {
                                                    console.log("not exiosts ", fh)
                                                    let wrongCount = user.users[0].wrongInput
                                                    if (wrongCount < 3) {
                                                        Game.findOneAndUpdate({ isOnGoing: true, users: { $elemMatch: { mobile: mob } } }, { $set: { "users.$.wrongInput": wrongCount + 1 } }).then(user => {
                                                            twiml.message(`No FH Matching, you have only ${3 - (wrongCount + 1)} chance left`)
                                                            res.set('Content-Type', 'text/xml');
                                                            return res.status(200).send(twiml.toString());
                                                            // return res.send({
                                                            //     statusCode: 200,
                                                            //     message: `No FH Matching, you have only ${3 - (wrongCount + 1)} chance left`,
                                                            // })
                                                        }).catch(error => {
                                                            console.log(error.message)
                                                            return res.status(500).send(error.message)
                                                        })
                                                    } else {
                                                        Game.findOneAndUpdate({ isOnGoing: true, users: { $elemMatch: { mobile: mob } } }, { $set: { "users.$.isTerminated": true } }).then(user => {
                                                            twiml.message(`You are terminated from this game`)
                                                            res.set('Content-Type', 'text/xml');
                                                            return res.status(200).send(twiml.toString());
                                                            // return res.send({
                                                            //     statusCode: 200,
                                                            //     message: `You are terminated from this game`,
                                                            // })
                                                        }).catch(error => {
                                                            console.log(error.message)
                                                            return res.status(500).send(error.message)
                                                        })
                                                    }
                                                }

                                            }
                                        }

                                    })
                                }
                                // if user is terminated ============
                                else {
                                    twiml.message(`You are terminated from this on going game`)
                                    res.set('Content-Type', 'text/xml');
                                    return res.status(200).send(twiml.toString());
                                    // return res.send({
                                    //     statusCode: 401,
                                    //     message: "You are terminated from this on going game"
                                    // })
                                }
                            }).catch(error => {
                                return res.status(500).send(error.message)
                            })

                        }).catch(error => {
                            return res.status(500).send(error.message)
                        })

                    }).catch(error => {
                        return res.send(error.message)
                    })





                }

                else {
                    return res.send({
                        statusCode: 501,
                        message: "Not Valid Payload"
                    })
                }




            }
        }).catch(error => {
            return res.status(500).send(error.message)
        })

    } catch (error) {
        return res.send(error)
    }
}






