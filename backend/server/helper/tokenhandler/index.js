import jwt from 'jsonwebtoken'

const privateKey = process.env.PRIVATE_KEY;

export function generateToken(payload){
    let token = jwt.sign(payload, privateKey)
    return token;
}