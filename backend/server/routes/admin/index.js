import express from 'express'
import {signIn, signUp} from '../../controller/admin/index.js'

const adminRouter = express.Router()

adminRouter.get('/admin', (req, res)=>{
    return res.send('admin Router')
})
adminRouter.post('/admin/signup', signUp)
adminRouter.post('/admin/login', signIn)

export default adminRouter;