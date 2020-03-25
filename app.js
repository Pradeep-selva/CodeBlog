var bodyParser= require('body-parser')
var mongoose= require('mongoose')
var express= require('express')
var path = require('path')
var methodOverride= require('method-override')
var app=express()
const publicDir= path.join(__dirname,'/public')

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended:true}))
app.use('/',express.static(publicDir))
app.use(methodOverride("_method"))

mongoose.connect('mongodb://localhost:27017/codeBlog', {
    useUnifiedTopology:true,
    useNewUrlParser:true
})
var blogSchema= mongoose.Schema({
    title:String,
    image:String,
    body:String,
    created: {
        type:Date,
        default:Date.now
    }
})
var Blog = mongoose.model('blog', blogSchema)


app.get('/', (req,res)=>{
    res.redirect('/blogs')
})

app.get('/blogs', (req,res)=>{

    Blog.find({},(err,blogs)=>{
        if(err){
            console.log(err)
        } else{
            
            res.render('index',{blogs:blogs})
        }
    })

})

app.get('/blogs/new', (req,res)=>{
    res.render('new')
})

app.post('/blogs', (req,res)=>{

    Blog.create({
        title: req.body.title,
        image:req.body.image,
        body:req.body.content
    },(err,blogs)=>{
        if(err){
            console.log(err)
        } else{
            res.redirect('/blogs')
        }
    })

})

app.get('/blogs/:id',(req,res)=>{

    Blog.findById(req.params.id,(err,blog)=>{
        res.render('blog',{blog:blog})
    })

})

app.get('/blogs/:id/edit', (req,res)=>{

    Blog.findById(req.params.id,(err,blog)=>{
        if(err){
            console.log(err)
        }
        else{
            res.render('edit', {blogs:blog})
        }
    })

})

app.put('/blogs/:id', (req,res)=>{
    
    Blog.findByIdAndUpdate({_id:req.params.id}, {
        $set:{
            title:req.body.title,
            image:req.body.image,
            body:req.body.content
        }
    }, (err,blog)=>{
        res.redirect('/blogs/'+req.params.id)
    })

})

app.delete('/blogs/:id', (req,res)=>{
    Blog.findByIdAndDelete({_id:req.params.id},(err,r)=>{
        if(err){
            console.log(err)
        } else{
            res.redirect('/blogs')
        }
    })
})

app.listen(process.env.PORT||8080, ()=>{
    console.log('CodeBlog is running!')
})