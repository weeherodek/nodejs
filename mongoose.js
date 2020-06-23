
//Aprendendo Mongoose


const mongoose = require('mongoose')
const express = require('express')
const bodyParser = require('body-parser')
const { json } = require('body-parser')

bodyParser.urlencoded(json)

const app = express()

app.use(bodyParser.urlencoded({ extended:true}));

mongoose.connect("mongodb://localhost/mongodb", {useNewUrlParser:true, useUnifiedTopology:true})

var schema = new mongoose.Schema({ name: 'string', size: 'string' });
var Tank = mongoose.model('Tank', schema);

var small = new Tank({ size: 'tiny' });
small.save(function (err) {
  if (err) return handleError(err);
  // saved!
});

app.get('/blog', (req,res)  =>{
    mongoose.model('Tank').find((err,Tank) =>{
        res.send(Tank);
    })
})

const porta = 8081
app.listen(porta, () =>{
    console.log("Node JS rodando na porta: "+ porta)
})