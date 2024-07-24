const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config()
const authentication = (req,res,next)=>{
    const autheader = req.headers.authorization
    const token = autheader

    jwt.verify(token,process.env.ACCESS_KEY,(error,user)=>{
        if(error){
            return res.status(400).json({msg:'not varified'})
        }
        req.user = user
        next()
    })
}

module.exports = authentication