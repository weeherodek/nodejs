const express = require('express')
const router = express.Router()
const {authAdmin} = require('../helpers/authAdmin')

require("../models/Categoria")
require("../models/Postagem")

const mongoose = require('mongoose')

const Categoria = mongoose.model("categoria")
const Postagem = mongoose.model("postagem")

router.get('/', authAdmin, (req, res) => {
    res.render("admin/index")
})


router.get('/categoria', authAdmin,(req,res) =>{
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


router.post('/categoria/nova', authAdmin,(req,res) =>{

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

router.get("/categoria/edit/:id",authAdmin, (req,res)=>{
    Categoria.findOne({_id:req.params.id}).lean().then((categoria)=>{
        res.render("admin/editCategoria", categoria)
    }).catch((err) =>{
        req.flash("error_msg", "Categoria não existe !")
        res.redirect("/admin/categoria")
    })
})


router.post("/categoria/edit",authAdmin, (req,res)=>{
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

router.post("/categoria/del/:id",authAdmin, (req,res)=>{
    const categoriaAntiga = req.body.nome
    Categoria.deleteOne({_id:req.params.id}).then(()=>{
        req.flash("success_msg",`Categoria ${categoriaAntiga} deletada com sucesso!`)
        res.redirect("/admin/categoria")
    }).catch((err)=>{
        req.flash("error_msg",`Erro ao deletar categoria ${categoriaAntiga}, tente novamente !`)
        res.redirect("/admin/categoria/")
    })
})

router.get("/postagem/",authAdmin, (req,res)=>{
    Postagem.find().populate("categoria").sort({data:"desc"}).then((postagem)=>{
        res.render("admin/postagem",{Postagem:postagem.map(postagem=>postagem.toJSON())})
    }).catch((err)=>{
        req.flash("error_msg","Houve um erro ao carregar as postagens: "+ err)
        res.redirect("/admin")
    })
})

router.get("/postagem/add",authAdmin, (req,res)=>{
    Categoria.find().lean().then((categoria)=>{
        res.render("./admin/addPostagem", {categoria:categoria})
    }).catch((err)  =>{
        req.flash("error_msg","Houve um erro ao carregar o formulário de postagens")
    })
    
})


router.post("/postagem/nova",authAdmin,(req,res)=>{
    
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


router.get("/postagem/edit/:id",authAdmin,(req,res) =>{
    Postagem.findOne({_id:req.params.id}).lean().then((postagem)=>{
        Categoria.find().lean().then((categoria)=>{
            res.render("admin/editPostagem", {categoria:categoria, postagem:postagem})
        }).catch(()=>{
            req.flash("error_msg","Erro ao acessar post, tente novamente !")
            res.redirect("/admin/postagem")
        })    
    })
        
})

router.post("/postagem/edit",authAdmin, (req,res)=>{
    const postagemAtt = {        
        titulo: req.body.titulo,
        slug: req.body.slug,
        categoria: req.body.categoria,
        descricao: req.body.descricao,
        conteudo: req.body.conteudo,
        auto: req.body.autor
    }   
    Postagem.findOneAndUpdate({_id:req.body.id},postagemAtt,{new:true}).then(()=>{
        req.flash("success_msg","Postagem editada com sucesso !")
        res.redirect("/admin/postagem")
    })
})

router.post("/postagem/del/:id",authAdmin, (req,res) =>{
    Postagem.deleteOne({_id:req.params.id}).then(()=>{
        req.flash("success_msg","Postagem excluída com sucesso !")
        res.redirect("/admin/postagem")
    }).catch((err)=>{
        req.flash("error_msg","Erro ao excluir arquivo, tente novamente !")
        res.redirect("/admin/postagem")
    })
})


module.exports = router;