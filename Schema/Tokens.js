const mongoose = require('mongoose')

const Tokenschema = mongoose.Schema({
    token:{
        type:String
    }
})


const Tokenmodel = mongoose.model('tokens',Tokenschema)

module.exports = Tokenmodel