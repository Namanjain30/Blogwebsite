const mongoose = require('mongoose')


const Createsc = mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    categories:{
        type:String,
        required:true
    },
    picture:{
        type:String,
    },
    createddate:{
        type:Date,
        required:true
    },
})


const modll = mongoose.model('createpost',Createsc)
module.exports = modll