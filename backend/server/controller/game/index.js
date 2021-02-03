import Game from '../../../database/models/game/index.js'
import User from '../../../database/models/users/index.js'
import tambola from 'tambola-generator'
import mongoose from '../../../database/connect.js'

export function createGame(req, res) {
    console.log(req.body)
    let gameSchema = req.body
    gameSchema.gameDate = new Date(`${req.body.date} ${req.body.time}`)
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

export function fetchAllGame(req, res) {
    Game.find({ gameDate: { $gte: new Date() } }).select(" name gameDate users createdAt done ").then(result => {
        console.log(result)
        return res.send({
            statusCode: 200,
            result: result,
        })
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


function arrCheck(arr1, arr2){
    let finArr = arr2
    if(arr2.length === 3){
        finArr = [...arr2[0], ...arr2[1], ...arr2[2]]
    }
    let result = false
    for(let i=0; i < finArr.length; i++){
        if(finArr[i]>0){
            if(arr1.includes(finArr[i])){
                result = true
            }else{
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
                                Game.findOneAndUpdate({_id: gid, users: { $elemMatch: { mobile: mob } }},  { $push: { users: userSchema } }, { new: true }).then(result => {
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
                    else if (payload.length == 2 && payload == "TL" || payload == "ML" ||  payload == "BL" || payload == "FH") {
                        console.log("Checkin for TL,ML....")
                        console.log(mob)

                        Game.findOne({_id: gid}, {_id: 1, done: 1, topLine: 1, middleLine: 1, bottomLine: 1, fullHousie:1, users: { $elemMatch: { mobile: req.params.mob } }}).then(user => {
                            if(user === null){
                                return res.send("User not found")
                            }
                            else{
                                if(payload === "TL"){
                                    let tl = user.users[0].ticket[0]
                                    if(arrCheck(user.users[0].done, tl) && arrCheck(user.done, tl)){
                                        console.log("exists ",tl)
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
                                    }else{
                                        console.log("not exiosts ",tl)
                                        return res.send({
                                            statusCode: 401,
                                            message: "No TL Matching"
                                        })
                                    }

                                    
                                }
                                else if(payload === "ML"){
                                    let ml = user.users[0].ticket[1]
                                    if(arrCheck(user.users[0].done, ml) && arrCheck(user.done, ml)){
                                        console.log("exists ",ml)
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
                                    }else{
                                        console.log("not exiosts ",ml)
                                        return res.send({
                                            statusCode: 401,
                                            message: "No ML Matching"
                                        })
                                    }
                                    
                                }
                                else if(payload === "BL"){
                                    let bl = user.users[0].ticket[2]
                                    if(arrCheck(user.users[0].done, bl) && arrCheck(user.done, bl)){
                                        console.log("exists ",bl)
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
                                    }else{
                                        console.log("not exiosts ",bl)
                                        return res.send({
                                            statusCode: 401,
                                            message: "No BL Matching"
                                        })
                                    }
                                    
                                }
                                else if(payload === "FH"){
                                    let fh = user.users[0].ticket
                                    if(arrCheck(user.users[0].done, fh) && arrCheck(user.done, fh)){
                                        console.log("exists ",fh)
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
                                    }else{
                                        console.log("not exiosts ",fh)
                                        return res.send({
                                            statusCode: 401,
                                            message: "No FH Matching"
                                        })
                                    }
                                    
                                }
                            }                                    
                           
                        })






                        // Game.aggregate([
                        //     {
                        //         $match: {
                        //             "_id": mongoose.Types.ObjectId(gid),
                        //         }
                        //     },
                        //     {
                        //         $project: {
                        //             users: {
                        //                 $filter: {
                        //                     input: "$users",
                        //                     as: "user",
                        //                     cond: {
                        //                         $eq: ["$$user.mobile", parseInt(mob)]
                        //                     }
                        //                 }
                        //             }
                        //         }
                        //     }
                        // ]).then(user => {
                        //     console.log(user)
                        //     if (user === null) {
                        //         return res.send({
                        //             statusCode: 201,
                        //             message: "First Join the game using JOIN Code"
                        //         })
                        //     }
                        //     if (user !== null) {
                        //         console.log("user !== null")
                        //         console.log(user[0].users[0]._id)
                        //         // first finds the documnet, and then find the user in that document
                        //         Game.findOne({"users._id": user[0].users[0]._id}, {_id: 0,users: { $elemMatch: { mobile: req.params.mob } }}).then(result => {
                                    
                        //             return res.send(result)
                        //         })
                        //     }
                        // }).catch(error => {
                        //     return res.send(error.message)
                        // })
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




// export function PlayGame(req, res) {
//     console.log(req.params)
//     let payload = req.params.payload
//     let gid = req.params.gid
//     let mob = req.params.mob

//     if (!mongoose.Types.ObjectId.isValid(gid)) return res.send("Invalid Object ID")

//     User.findOne({ mobile: mob }).then(user => {
//         if (user === null) {
//             return res.send({
//                 statusCode: 404,
//                 message: "Please Register to website First",
//                 link: "http://localhost:3000/registration"
//             })
//         } else {
//             // find the game exists or not
//             Game.findOne({ _id: gid }).then(result => {
//                 if (result === null) {
//                     return res.send({
//                         statusCode: 404,
//                         message: "Game Not found"
//                     })
//                 }
//                 // if game exists
//                 if (result !== null) {
//                     let userSchema = {
//                         mobile: mob,
//                         ticket: tambola.getTickets(1)[0]
//                     }
//                     //checks for game joining
//                     if (payload.includes("JOIN") || payload.includes("join") && payload.length > 2) {

//                         Game.findOne({ _id: gid, users: { $elemMatch: { mobile: mob } } }).then(user => {
//                             if (user !== null) {
//                                 return res.send({
//                                     statusCode: 201,
//                                     message: "User Already registred for the game"
//                                 })
//                             } else {
//                                 Game.findOneAndUpdate({_id: gid, users: { $elemMatch: { mobile: mob } }},  { $push: { users: userSchema } }, { new: true }).then(result => {
//                                     if (result === null) {
//                                         return res.send({
//                                             statusCode: 404,
//                                             message: "Game not found"
//                                         })
//                                     }
//                                     return res.send(result)
//                                 }).catch(error => {
//                                     return res.status(500).send(error.message)
//                                 })
//                             }
//                         })
//                     } 
//                     else if (payload.length <= 2 && !isNaN(payload)) {
//                         console.log("Data entery in db")
//                         Game.findOne({ _id: gid, users: { $elemMatch: { mobile: req.params.mob } } }).then(user => { // if user not joined the game
//                             if (user === null) {
//                                 return res.send({
//                                     statusCode: 201,
//                                     message: "First Join the game using JOIN Code"
//                                 })
//                             }
//                             if (user !== null) { // if user already in the game then save data to user object
//                                 Game.findOneAndUpdate({ _id: gid, users: { $elemMatch: { mobile: req.params.mob } } }, { $addToSet: { "users.$.done": payload } }, { new: true }).then(result => {
//                                     if (result === null) {
//                                         return res.send({
//                                             statusCode: 404,
//                                             message: "Game/User Not found"
//                                         })
//                                     }
//                                     return res.send(result)
//                                 }).catch(error => {
//                                     return res.status(500).send(error.message)
//                                 })
//                             }
//                         }).catch(error => {
//                             return res.send(error.message)
//                         })
//                     } 
//                     //if TL,ML...
//                     else if (payload.length == 2 && payload == "TL" || payload == "ML" ||  payload == "BL" || payload == "FH") {
//                         console.log("Checkin for TL,ML....")
//                         // Game.findOne({ _id: gid, users: { $elemMatch: { mobile: req.params.mob } } }).then(user => { // if user not joined the game
//                         //     if (user === null) {
//                         //         return res.send({
//                         //             statusCode: 201,
//                         //             message: "First Join the game using JOIN Code"
//                         //         })
//                         //     }
//                         //     if (user !== null) { // if user already in the game then save data to user object
//                         //         Game.findOneAndUpdate({ _id: gid, users: { $elemMatch: { mobile: req.params.mob } } }, { $addToSet: { "users.$.done": payload } }, { new: true }).then(result => {
//                         //             if (result === null) {
//                         //                 return res.send({
//                         //                     statusCode: 404,
//                         //                     message: "Game/User Not found"
//                         //                 })
//                         //             }
//                         //             return res.send(result)
//                         //         }).catch(error => {
//                         //             return res.status(500).send(error.message)
//                         //         })
//                         //     }
//                         // }).catch(error => {
//                         //     return res.send(error.message)
//                         // })
//                     } 
                    
//                     else {
//                         return res.send({
//                             statusCode: 501,
//                             message: "Not Valid Payload"
//                         })
//                     }

//                 }
//             }).catch(error => {
//                 return res.status(500).send(error.message)
//             })

//         }
//     }).catch(error => {
//         return res.status(500).send(error.message)
//     })
// }




// Game.aggregate([
//     {
//         $match: {
//             "_id": mongoose.Types.ObjectId(gid),
//         }
//     },
//     {
//         $project: {
//             users: {
//                 $filter: {
//                     input: "$users",
//                     as: "user",
//                     cond: {
//                         $eq: ["$$user.mobile", parseInt(mob)]
//                     }
//                 }
//             }
//         }
//     }
// ]).then(user => {
//     console.log(user)
//     if (user === null) {
//         return res.send({
//             statusCode: 201,
//             message: "First Join the game using JOIN Code"
//         })
//     }
//     if (user !== null) {
//         console.log("user !== null")
//         // user[0].users[0].isTerminated
//         console.log(user[0].users[0]._id)
//         // first finds the documnet, and then find the user in that document
//         Game.findOne({"users._id": user[0].users[0]._id}, {_id: 0,users: { $elemMatch: { mobile: req.params.mob } }}).then(result => {
            
//             return res.send(result)
//         })
//         // Game.findOne({_id: user[0].users[0]._id}).then(result => {
//         //     console.log(result)
//         //     return res.send(result)
//         // })
//         // return res.send(user)
//     }
// }).catch(error => {
//     return res.send(error.message)
// })