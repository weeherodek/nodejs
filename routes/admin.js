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
    Categoria.find().sort({data:'desc'}).then((categoria)=>{
        res.render("admin/categoria",{Categoria:categoria.map(categoria=>categoria.toJSON())})
    }).catch((err)=>{
        req.flash("error_msg","Houve um erro ao carregar as categorias: "+ err)
        res.redirect("/admin")
    })
})

router.get('/categoria/add', (req,res) =>{
    res.render("admin/addcategoria")
})


router.post('/categoria/nova', (req,res) =>{

    var erros = []

    //Validação Formulário
    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null)
        erros.push({texto: "Nome Inválido !"})
    if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null)
        erros.push({texto: "Slug Inválido !"})
    if(req.body.nome.length < 4)
        erros.push({texto: "Nome da categoria muito pequeno"})
    else{
        const novaCategoria = {
            nome: req.body.nome,
            slug: req.body.slug
        }
        new Categoria(novaCategoria).save( (err) =>{
            if(err) {
                req.flash("error_msg","Erro ao cadastrar categoria :" + req.body.nome) 
                res.render("admin/addcategoria", {erros: erros})
        }
            else{
                req.flash("success_msg",`Categoria ${req.body.nome} criada com sucesso !`)
                res.redirect("/admin/categoria")
            }
        })
    }
    
})

router.get('/categoria/teste',(req,res) =>{
    mongoose.model('categoria').find((err,Categoria) =>{
        res.send(Categoria);
    })
})

module.exports = router;