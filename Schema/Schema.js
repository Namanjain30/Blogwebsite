const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const Schema = mongoose.Schema({
    name:{
        type:String,
    },
    username:{
        type:String
    },
    password:{
        type:String
    }
})

Schema.pre('save',function (next){
    if(this.isModified('password')){
        const salt = bcrypt.genSaltSync(10)
    this.password = bcrypt.hashSync(this.password, salt)
    }
    next()
})

const modle = mongoose.model('signupdata',Schema)
module.exports = modle