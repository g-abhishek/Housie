import express from 'express'
import {createGame, joinGame, appearedNumbers, fetchAllGame, PlayGame, completedUsers, completedTopLineUsers, completedMiddleLineUsers, completedBottomLineUsers, completedFullHousieUsers, announceTLWinner, announceMLWinner, announceBLWinner, announceFHWinner, fetchWinnerUsers, senSms, startGame, stopGame, onGoingGame, playGameWhatsapp} from '../../controller/game/index.js'
import { authorizer } from '../../helper/authorizer/index.js'

import twilio from 'twilio';
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const cl = twilio(accountSid, authToken);
const { MessagingResponse } = twilio.twiml;

const gameRouter = express.Router()

gameRouter.post('/admin/game/create/', authorizer(), createGame)
gameRouter.put('/admin/game/start/', authorizer(), startGame)
gameRouter.put('/admin/game/stop/', authorizer(), stopGame)
gameRouter.get('/admin/game/ongoing/', authorizer(), onGoingGame)
gameRouter.post('/admin/game/join/:gid/mobile/:mob/', joinGame)
// gameRouter.post('/admin/game/:payload/mobile/:mob/', PlayGame)
gameRouter.post('/admin/game/:gid/payload/:payload/mobile/:mob/', PlayGame)
gameRouter.post('/admin/game/playgame/', playGameWhatsapp)

gameRouter.post('/admin/game/appeared/', authorizer(), appearedNumbers)
gameRouter.get('/admin/game/completedusers/:gid', completedUsers)
gameRouter.get('/admin/game/topLine/:gid', completedTopLineUsers)
gameRouter.get('/admin/game/middleLine/:gid', completedMiddleLineUsers)
gameRouter.get('/admin/game/bottomLine/:gid', completedBottomLineUsers)
gameRouter.get('/admin/game/fullHousie/:gid', completedFullHousieUsers)
gameRouter.get('/admin/game/fetch/all', authorizer(), fetchAllGame)

gameRouter.put('/admin/game/winner/topLine/', authorizer(), announceTLWinner)
gameRouter.put('/admin/game/winner/middleLine/', authorizer(), announceMLWinner)
gameRouter.put('/admin/game/winner/bottomLine/', authorizer(), announceBLWinner)
gameRouter.put('/admin/game/winner/fullHousie/', authorizer(), announceFHWinner)
gameRouter.get('/admin/game/winner/all/:gid', authorizer(), fetchWinnerUsers)

gameRouter.post("/sms" , (req, res) =>{
    console.log(req.body)
    console.log(req.body.Body)
    console.log(req.parameters)
    // console.log(req.query)
    // console.log(req.headers)
    const twiml = new MessagingResponse();
    // console.log(twiml.response)
    try {
        twiml.message('helloo')
        res.set('Content-Type', 'text/xml');
        return res.status(200).send(twiml.toString());
    }catch(error){
        return res.send(error)
    }
    
})

gameRouter.post('/sendsms', senSms)




export default gameRouter;