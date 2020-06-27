const express = require('express')
const router = express.Router()

require("../models/Categoria")
require("../models/Postagem")

const mongoose = require('mongoose')

const Categoria = mongoose.model("categoria")
const Postagem = mongoose.model("postagem")

router.get('/', (req, res) => {
    res.render("admin/index")
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
                res.render("/admin/addCategoria", {erros: erros})
        }
            else{
                req.flash("success_msg",`Categoria ${req.body.nome} criada com sucesso !`)
                res.redirect("/admin/categoria")
            }
        })
    }
    
})

router.get("/categoria/edit/:id", (req,res)=>{
    Categoria.findOne({_id:req.params.id}).lean().then((categoria)=>{
        res.render("admin/editCategoria", categoria)
    }).catch((err) =>{
        req.flash("error_msg", "Categoria não existe !")
        res.redirect("/admin/categoria")
    })
})


router.post("/categoria/edit", (req,res)=>{
    Categoria.findOne({_id: req.body.id}).then((categoria) =>{
        const nomeAntigo = categoria.slug
        const slugAntigo = categoria.slug

        categoria.nome = req.body.nome
        categoria.slug = req.body.slug

        categoria.save().then(() =>{
            req.flash("success_msg",`Categoria: ${nomeAntigo} e Slug: ${slugAntigo} alterados !
            Novo nome: ${categoria.nome}
            Novo Slug: ${categoria.slug}`)
            res.redirect("/admin/categoria")
        }).catch((err)=>{
            req.flash("error_msg", "Houve um erro interno ao alterar a categoria")
            res.redirect("/admin/categoria/edit/" + req.body.id)
        })
        }).catch((err)=>{
            req.flash("error_msg","Não foi possível editar a categoria desejada !")
            res.redirect("/admin/categoria")
    })
})

router.post("/categoria/del/:id", (req,res)=>{
    const categoriaAntiga = req.body.nome
    Categoria.deleteOne({_id:req.params.id}).then(()=>{
        req.flash("success_msg",`Categoria ${categoriaAntiga} deletada com sucesso!`)
        res.redirect("/admin/categoria")
    }).catch((err)=>{
        req.flash("error_msg",`Erro ao deletar categoria ${categoriaAntiga}, tente novamente !`)
        res.redirect("/admin/categoria/")
    })
})

router.get("/postagem/", (req,res)=>{
    Postagem.find().populate("categoria").sort({data:"desc"}).then((postagem)=>{
        res.render("admin/postagem",{Postagem:postagem.map(postagem=>postagem.toJSON())})
    }).catch((err)=>{
        req.flash("error_msg","Houve um erro ao carregar as postagens: "+ err)
        res.redirect("/admin")
    })
})

router.get("/postagem/add", (req,res)=>{
    Categoria.find().lean().then((categoria)=>{
        res.render("./admin/addPostagem", {categoria:categoria})
    }).catch((err)  =>{
        req.flash("error_msg","Houve um erro ao carregar o formulário de postagens")
    })
    
})


router.post("/postagem/nova",(req,res)=>{
    
    //fazer validação postagem
   
    var erros = []

        const novaPostagem = {
            titulo : req.body.titulo,
            slug : req.body.slug,
            categoria : req.body.categoria,
            descricao : req.body.descricao,
            conteudo : req.body.conteudo,
            autor : req.body.autor
        }
    new Postagem(novaPostagem).save((err) =>{
        if(err){
            req.flash("error_msg",`Erro ao cadastrar postagem, erro: ${err}`)
            res.redirect("/admin/postagem/nova", {erros: erros})
        }
        else{
            req.flash("success_msg",`Postagem cadastrada com sucesso !`)
            res.redirect("/admin/postagem")
        }
    })
    
})


router.get("/postagem/edit/:id",(req,res) =>{
    Postagem.findOne({_id:req.params.id}).populate("categoria").lean().then((postagem)=>{
            res.render("admin/editPostagem", {postagem:postagem , categoria:categoria})
        }).catch((err)=>{
            req.flash("error_msg","Houve um erro interno ao editar a postagem !")
        })
})

router.post("/postagem/edit", (req,res)=>{
    const postagemAtt = {        
        titulo: req.body.titulo,
        slug: req.body.slug,
        categoria: req.body.categoria,
        descricao: req.body.descricao,
        conteudo: req.body.conteudo,
        auto: req.body.autor
    }   
    Postagem.findOneAndUpdate({_id:req.body.id},postagemAtt)
})


module.exports = router;