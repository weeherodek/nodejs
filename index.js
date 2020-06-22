
//Dependencias
const mongoose = require('mongoose')
const express = require('express')
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')

const app = express()

mongoose.connect('mongodb://localhost/teste', {useNewUrlParser: true, useUnifiedTopology: true});

/*const db = mongoose.connection.then(() =>{
    console.log("Mongo conectado com sucesso !");
}).catch((err) =>{
    console.log("Erro ao conectar ao MongoDB:" + err);
});*/

//Outros

const port = 8081
app.listen(port, () =>{
    console.log("Node JS rodando na porta :"+ port)
})