const mongoose = require('mongoose')


const Commentsc = new mongoose.Schema({
    name:String,
    postid:String,
    comment:String,
    date:{
        type:Date
    }
})

const cmodel = mongoose.model('comments',Commentsc)
module.exports = cmodel