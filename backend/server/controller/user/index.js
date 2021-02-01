import User from '../../../database/models/users/index.js'

export function registration(req, res) {
    console.log(req.body)

    User.findOne({ 'mobile': req.body.mobile }).then(user => {
        if(user){
            return res.send({
                statusCode: 201,
                message: "email already exists"
            })
        }
        else if (user === null) {
            let newUser = new User();
            newUser.name = req.body.name;
            newUser.mobile = req.body.mobile;

            newUser.save().then(result => {
                console.log(result)
                return res.send({
                    statusCode: 200,
                    message: "Registration Successfull"
                })
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