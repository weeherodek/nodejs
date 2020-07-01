//Dependencias
const mongoose = require('mongoose')
const express = require('express')
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const path = require('path')
const session = require('express-session')
const flash = require('connect-flash')
const moment = require('moment')
const passport = require('passport')

const app = express()

require("./config/auth")(passport)
require("./models/Postagem")
require("./models/Categoria")
require("./models/Usuario")


const Postagem = mongoose.model("postagem")
const Categoria = mongoose.model("categoria")
const Usuario = mongoose.model("usuario")


const admin = require('./routes/admin')
const usuario = require('./routes/usuario')


const { urlencoded } = require('body-parser')
const { allowedNodeEnvironmentFlags } = require('process')


//configurações
    //Sessão
    app.use(session({
        secret:"cursodenode",
        resave:true,
        saveUninitialized:true
    }))

    app.use(passport.initialize())

    app.use(passport.session())

    app.use(flash())

    //Middleware
    app.use((req,res,next) =>{
        res.locals.success_msg = req.flash("success_msg")
        res.locals.error_msg = req.flash("error_msg")
        res.locals.error = req.flash("error")
        res.locals.user = req.user || null
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
            },
            formatDateHour:(date)=>{
                return moment(date).format("DD/MM/yyyy HH:mm:ss")
            }
            },

        allowedProtoMethods:{
            trim:true,
        }
        }))
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
    app.use('/usuario',usuario)

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
        Categoria.findOne({slug:req.params.slug}).lean().then((categoria)=>{
            if(categoria){
                Postagem.find({categoria:categoria._id}).lean().then((postagem)=>{
                    res.render("categoria/postCategoria",{postagem:postagem,categoria:categoria})
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

    app.get("/usuario", (req,res)=>{
        Usuario.find().lean().then((usuario)=>{
            res.render("usuario/index",{usuario:usuario})
        }).catch((err)=>{
            req.flash("error_msg","Erro interno, tente novamente")
            res.redirect("/")
        })
    })



//Outros

const port = process.env.PORT || 8081
app.listen(port, () =>{
    console.log("Node JS rodando na porta: "+ port)
})