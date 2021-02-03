import express from 'express'
import {createGame, joinGame, appearedNumbers, fetchAllGame, PlayGame, completedUsers, completedTopLineUsers, completedMiddleLineUsers, completedBottomLineUsers, completedFullHousieUsers} from '../../controller/game/index.js'
import { authorizer } from '../../helper/authorizer/index.js'

const gameRouter = express.Router()

gameRouter.post('/admin/game/create/', authorizer(), createGame)
gameRouter.post('/admin/game/join/:gid/mobile/:mob/', joinGame)
// gameRouter.post('/admin/game/:payload/mobile/:mob/', PlayGame)
gameRouter.post('/admin/game/:gid/payload/:payload/mobile/:mob/', PlayGame)
gameRouter.post('/admin/game/appeared/', authorizer(), appearedNumbers)
gameRouter.get('/admin/game/completedusers/:gid', completedUsers)
gameRouter.get('/admin/game/topLine/:gid', completedTopLineUsers)
gameRouter.get('/admin/game/middleLine/:gid', completedMiddleLineUsers)
gameRouter.get('/admin/game/bottomLine/:gid', completedBottomLineUsers)
gameRouter.get('/admin/game/fullHousie/:gid', completedFullHousieUsers)
gameRouter.get('/admin/game/fetch/all', authorizer(), fetchAllGame)

export default gameRouter;