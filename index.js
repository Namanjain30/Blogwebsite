const express = require('express')
require('../server/Mongoo/Mongooses.js')
const modle = require('./Schema/Schema')
const cors = require('cors')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
const Tokenmodel = require('./Schema/Tokens.js')
// const upload = require('./middleware/Upload.js')
const bodyparser = require('body-parser')
const multer = require('multer')
const Imagess = require('./Schema/Imagesc.js')
const authentication = require('./Check.js')
const modell = require('./Schema/Createsc.js')
const cmodel = require('./Schema/Commentsc.js')
// const upload = multer({dest:"uploads/"})
const app = express()
app.use(express.json())
app.use(cors())
app.use(bodyparser.json({extended:true}))
app.use(bodyparser.urlencoded({extended:true}))
dotenv.config()



app.post('/signup',(req,res)=>{
    const {name ,username ,password} = req.body
    
    modle.findOne({username}).then((datas)=>{
        if(datas){
            return res.status(501).json({msg:'the usename alerady exist'})
        }
        const data = new modle(req.body)
        data.save()
        .then(() => {
            return res.status(200).json({ message: "user registred" });
        })
        .catch((e) => {
            console.log(e)
            return res.status(500).json({ error: "failed to register" });
        });
    })
})

app.post('/login',(req,res)=>{
    const {username,password} = req.body
    modle.findOne({username}).then(async (datas)=>{
        if(datas){
            const check = await bcrypt.compare(password,datas.password)
            if(check){
                const accesstoken = jwt.sign(datas.toJSON(),process.env.ACCESS_KEY,{expiresIn:'15m'})
                const referstoken = jwt.sign(datas.toJSON(),process.env.REFRESE_KEY)
                const d = new Tokenmodel({token:referstoken})
                await d.save()
                return res.status(200).json({accesstoken:accesstoken,referstoken:referstoken,username:datas.username,name:datas.name})
            }
            else{
                return res.status(400).json({msg:'password is incorrect'})
            }
        }
        else{
            return res.status(500).json({msg:'Username is not present'})
        }
    })
})
// const url = 'http://localhost:8000'

// app.post('/file/upload',upload.single('file'),(req,res)=>{
//     if(!req.file){
//         return res.status(400).json({msg:'file not found'})
//     }
//     const imageurl = `${url}/file/${req.file.filename}`
//     return res.status(200).json(imageurl)
// })

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, '../client/src/images/')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() 
      cb(null,  uniqueSuffix+file.originalname)
    }
  })
  
const upload = multer({ storage: storage })

app.post('/upload-image',upload.single('file' ),async (req,res)=>{
    const imagename = req.file.filename
    try{
        await Imagess.create({image:imagename})
        return res.status(200).json({imagename:imagename})
    }
    catch{
        return res.status(400)
    }
})

app.post('/createpost',authentication,async (req,res)=>{
    try{
        const post = await new modell(req.body)
        post.save()
        return res.status(200).json('post send succ')
    }
    catch(error){
        return res.status(400).json('not happening')
    }
})

app.get('/takedata',authentication,async (req,res)=>{
    await modell.find({}).then(data=>{
        if(data){
            res.status(200).json(data)
        }
        else{
            res.status(400).json({msg:'not able to accept'})
        }
    })
})
app.get('/post/:id',authentication,async (req,res)=>{
    try{
        const post = await modell.findById(req.params.id)
        return res.status(200).json(post)
    }
    catch{
        return res.status(400).json({msg:'no data'})
    }
})
app.put('/update/:id',authentication,async (req,res)=>{
    try{
        const {username,title,description,categories,picture,createddate} = req.body
        const post = await modell.findById(req.params.id)
        if(!post){
            return res.status(400).json({msg:'post not found'})
        }
        await modell.findByIdAndUpdate(req.params.id,{$set:{username,title,description,categories,picture,createddate}})
        return res.status(200).json({msg:'done succesful'})
    }
    catch{
        return res.status(400).json({msg:'no data'})
    }
})


app.delete('/delete/:id',authentication,async (req,res)=>{
    // try{
        // const post = await modell.findById(req.params.id)
        // if(!post){
        //     return res.status(400).json({msg:'post not found'})
        // }
    //     console.log(post)
    //     await post.delete()
    //     return res.status(200).json({msg:'done succesful'})
    // }
    // catch{
    //     return res.status(400).json({msg:'no data'})
    // }
    const post = await modell.findById(req.params.id)
    if(!post){
        return res.status(400).json({msg:'post not found'})
    }
    await modell.findByIdAndDelete(req.params.id); 
    res.status(200).json({msg:'done'})
})

app.post('/comment/new',authentication,(req,res)=>{
    const data = new cmodel(req.body)
    data.save()
    res.status(200).json({msg:'ok'})
})

app.get('/comment/:id',authentication,async (req,res)=>{
    try{
        const post = await cmodel.find({postid:req.params.id})
        return res.status(200).json(post)
    }
    catch{
        return res.status(400).json({msg:'no data'})
    }
})

app.delete('/deletei/:id',async (req,res)=>{
    await cmodel.findByIdAndDelete(req.params.id)
    res.status(200).json({msg:'succesfully deleted'})
})

const PORT = process.env.PORT || 8000

app.listen(PORT,()=> console.log('connecting'))