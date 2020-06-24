const express = require('express')
const router = express.Router()

require("../models/Categoria")

const mongoose = require('mongoose')

const Categoria = mongoose.model("categoria")

router.get('/', (req, res) => {
    res.render("admin/index")
})

router.get('/posts', (req,res) =>{
    res.send("Posts do blog")
})

router.get('/categoria', (req,res) =>{
    res.render("admin/categoria")
})

router.get('/categoria/add', (req,res) =>{
    res.render("admin/addcategoria")
})


router.post('/categoria/nova', (req,res) =>{
    const novaCategoria = {
        nome: req.body.nome,
        slug: req.body.slug
    }
    new Categoria(novaCategoria).save( (err) =>{
        if(err) return res.send(err.message)
        else res.send(`Slug ${req.body.nome} cadastrado com sucesso !`);
    })
})

router.get('/categoria/teste',(req,res) =>{
    mongoose.model('categoria').find((err,Categoria) =>{
        res.send(Categoria);
    })
})

module.exports = router;