import express from 'express'
import { registration } from '../../controller/user/index.js'

const userRouter = express.Router()

userRouter.get('/user', (req, res)=>{
    return res.send('User Router')
})
userRouter.post('/user/registration', registration)
export default userRouter;