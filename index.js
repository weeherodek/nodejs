//Dependencias
const mongoose = require('mongoose')
const express = require('express')
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const path = require('path')
const session = require('express-session')
const flash = require('connect-flash')
const moment = require('moment')

const app = express()

require("./models/Postagem")
require("./models/Categoria")


const Postagem = mongoose.model("postagem")
const Categoria = mongoose.model("categoria")


const admin = require('./routes/admin')
const { urlencoded } = require('body-parser')


//configurações
    //Sessão
    app.use(session({
        secret:"cursodenode",
        resave:true,
        saveUninitialized:true
    }))

    app.use(flash())

    //Middleware
    app.use((req,res,next) =>{
        res.locals.success_msg = req.flash("success_msg")
        res.locals.error_msg = req.flash("error_msg")
        next()
    })

    //Body Parser
    app.use(bodyParser.urlencoded({extended:true}))
    app.use(bodyParser.json())
    

    //Handlebars
    app.engine('handlebars', handlebars({ 
        defaultLayout: 'main',
        helpers:{
            formatDate:(date)=>{
                return moment(date).format("DD/MM/YYYY")
            }
        }}))
    app.set('view engine', 'handlebars')

    //mongooose
    
    mongoose.Promise = global.Promise
    mongoose.connect('mongodb://localhost/testedb', {useNewUrlParser:true, useUnifiedTopology:true}, urlencoded).then(() =>{
        console.log("conectado ao banco de dados Mongo !")

    }).catch((err) =>{
        console.log("Erro ao se conectar ao banco Mongo:" + err)
    })

//public

    app.use(express.static(path.join(__dirname,"public")))

//rotas
    //home
    app.get('/', (req,res) => {
        Postagem.find().populate("categoria").sort({data_publicacao:"asc"}).lean().then((postagem)=>{ 
            Categoria.find().lean().then((categoria)=>{
                res.render("index", {postagem:postagem,categoria:categoria}) 
            })
        })      
    })

    app.get("/404",(req,res)=>{
        res.send("Erro:404 ao acessar a tela, tente novamente !")
    })

    app.use('/admin',admin)

    app.get("/postagem/:id", (req,res)=>{
        Postagem.findOne({_id:req.params.id}).lean().then((postagem)=>{
            res.render("postagem/postagem", {postagem:postagem})
        }).catch((err)=>{
            req.flash("error_msg","Erro ao acessar postagem, tente novamente !")
            res.redirect("/")
        })
    })

    app.get("/categoria",(req,res)=>{
        Categoria.find().lean().then((categoria)=>{
            res.render("categoria/index",{categoria:categoria})
        }).catch((err)=>{
            req.flash("error_msg","Erro interno, tente novamente")
            res.redirect("/")
        })
    })

    app.get("/categoria/:slug", (req,res)=>{
        Categoria.findOne({slug:req.params.slug}).then((categoria)=>{
            if(categoria){
                Postagem.find({categoria:categoria._id}).then((postagem)=>{
                    console.log(postagem)
                    res.render("postagem/postagem",{postagem:postagem,categoria:categoria})
                })
            }
            else{
                req.flash("error_msg","Categoria inválida !")
                res.redirect("/")
            }
        }).catch((err)=>{
            req.flash("error_msg","Categoria Inválida !")
            res.redirect("/")
        })
    })

    app.get("/postagem", (req,res)=>{
        Postagem.find().populate("categoria").lean().then((postagem)=>{
            res.render("postagem/index",{postagem:postagem})
        }).catch((err)=>{
            req.flash("error_msg","Erro interno, tente novamente")
            res.redirect("/")
        })
    })
//Outros

const port = 8081
app.listen(port, () =>{
    console.log("Node JS rodando na porta :"+ port)
})