const mongoose = require('mongoose')

const Imaagesc = mongoose.Schema(
    {image:String},
    {collection:"ImageDetails"}
)

const mmodel = mongoose.model('Images',Imaagesc)
module.exports = mmodel