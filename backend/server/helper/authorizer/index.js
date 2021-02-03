import expressJwt from 'express-jwt'
export function authorizer(){
    console.log("Checking Authorizer")
    return expressJwt({
        secret: process.env.PRIVATE_KEY,
        algorithms: ['sha1', 'RS256', 'HS256'],
    })
}