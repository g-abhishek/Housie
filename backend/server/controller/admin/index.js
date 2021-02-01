import Admin from '../../../database/models/admin/index.js'
import {generateToken} from '../../helper/tokenhandler/index.js'

export function signUp(req, res) {
    console.log(req.body)

    Admin.findOne({ 'email': req.body.email }).then(user => {
        if(user){
            return res.send({
                statusCode: 201,
                message: "email already exists"
            })
        }
        else if (user === null) {
            let newAdmin = new Admin();
            newAdmin.name = req.body.name;
            newAdmin.email = req.body.email;
            newAdmin.setPassword(req.body.password);

            newAdmin.save().then(result => {
                console.log(result)
                return res.send(result)
            }).catch(error => {
                console.log(error)
                return res.status(500).send(error.message)
            })
        }
    }).catch(error => {
        console.log(error)
        return res.status(500).send(error.message)
    })


}

export function signIn(req, res) {
    console.log(req.body)

    Admin.findOne({ 'email': req.body.email }).then(user => {
        console.log(user)
        if (user === null) {
            return res.send({
                statusCode: 404,
                message: "Not Data Found"
            })
        } else {
            if (user.verifyPassword(req.body.password)) {
                let token = generateToken({email: user.email})
                return res.send({
                    statusCode: 200,
                    message: 'User found',
                    user: {
                        name: user.name,
                        email: user.email
                    },
                    token: token
                })
            }else{
                return res.send({
                    statusCode: 403,
                    message: 'Wrong Password',
                })
            }
        }
    }).catch(error => {
        console.log(error)
        return res.status(500).send(error.message)
    })
}