//Dependencias
const mongoose = require('mongoose')
const express = require('express')
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const path = require('path')
const session = require('express-session')
const flash = require('connect-flash')


const app = express()

const admin = require('./routes/admin')
const { urlencoded } = require('body-parser')
//const { executionAsyncResource } = require('async_hooks')


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
    app.engine('handlebars', handlebars({ defaultLayout: 'main'}))
    app.set('view engine', 'handlebars')

    //mongooose
    
    mongoose.Promise = global.Promise
    mongoose.connect('mongodb://localhost:27017/testedb', {useNewUrlParser:true, useUnifiedTopology:true}, urlencoded).then(() =>{
        console.log("conectado ao banco de dados Mongo !")

    }).catch((err) =>{
        console.log("Erro ao se conectar ao banco Mongo:" + err)
    })

//public

    app.use(express.static(path.join(__dirname,"public")))

//rotas
    //home
    app.get('/', (req,res) => {
        res.send("Página principal")
    })


    app.use('/admin',admin)


//Outros

const port = 8081
app.listen(port, () =>{
    console.log("Node JS rodando na porta :"+ port)
})


//Testando banco de dados Mongo
var schema = new mongoose.Schema({ name: 'string', size: 'string' });

var Tank = mongoose.model('Tank', schema);

var small = new Tank({ name: "kitty", size: 'small' });
small.save(function (err) {
  if (err) return handleError(err);
  // saved!
});