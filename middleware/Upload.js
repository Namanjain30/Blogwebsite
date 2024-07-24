const {GridFsStorage} = require('multer-gridfs-storage')
const multer = require('multer')


const storage = new GridFsStorage({
    url:'mongodb://127.0.0.1:27017/Blogwebsite',
    Option:{useNewUrlParser:true},
    file:(request,file)=>{
        const match = ["image/png","image/jpg"]
        if(match.indexOf(file.nameType) === -1){
            return `${Date.now()}-blog-${file.originalname}`
        }
        return{
            backetName:"photos",
            filename:`${Date.now()}-blog-${file.originalname}`
        }
    }
})

module.exports = multer({storage})