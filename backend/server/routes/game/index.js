import express from 'express'
import {createGame, joinGame} from '../../controller/game/index.js'

const gameRouter = express.Router()

gameRouter.post('/admin/game/create/', createGame)
gameRouter.post('/admin/game/join/:gid/mobile/:mob/', joinGame)

export default gameRouter;