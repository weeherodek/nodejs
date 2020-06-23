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
    new Categoria(novaCategoria).save().then(() =>{
        console.log("Categoria criada com sucesso!")
    }).catch((err) =>{
        console.log("Erro ao criar categoria" + err)
    })

})

module.exports = router;