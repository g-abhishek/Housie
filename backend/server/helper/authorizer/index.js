import expressJwt from 'express-jwt'
export function authorizer(){
    return expressJwt({
        secret: process.env.PRIVATE_KEY,
        algorithms: ['sha1', 'RS256', 'HS256'],
    })
}