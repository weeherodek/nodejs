const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const bcrypt = require('bcryptjs')

const app = express()

require("../models/Usuario")

const Usuario = mongoose.model("usuario")

router.get("/cadastro", (req,res)=>{
        res.render("usuario/cadastro")  

})


router.post('/cadastrar', (req,res)=>{
    var erros = []
    if(!req.body.nome || req.body.nome == null){
        erros.push({texto:"Nome inválido"})
    }
    if(!req.body.email || req.body.email == null){
        erros.push({texto:"Email inválido"})
    }
    if(!req.body.senha || req.body.senha == null){
        erros.push({texto:"Senha inválida"})
    }
    if(!req.body.sobrenome || req.body.sobrenome == null){
        erros.push({texto:"Sobrenome inválido"})
    }
    if(req.body.senha != req.body.senha2){
        erros.push({texto:"Senhas divergentes, reconfirme sua senha"})
    }
    if(req.body.email != req.body.email2){
        erros.push({texto:"Emails divergentes, reconfirme seu email"})
    }
    if(erros.length > 0){
        res.render("usuario/cadastro", {erros:erros})
    }else{
        Usuario.findOne({email:req.body.email}).then((usuario)=>{
            if(usuario){
                req.flash("error_msg","Email já está sendo utilizado.")
                res.redirect("/usuario")
            }else{

                const NovoUsuario ={
                    nome: req.body.nome,
                    sobrenome: req.body.sobrenome,
                    email: req.body.email,
                    usuario: req.body.usuario,
                    senha: req.body.senha
                }

                bcrypt.genSalt(10,(err,salt)=>{
                    bcrypt.hash(NovoUsuario.senha, salt, (err,hash)=>{
                        if(err){
                            req.flash("erro_msg","Houve um erro interno ao salvar o usuário, tente novamente")
                            res.redirect("/usuario/cadastro")
                        }
                        NovoUsuario.senha = hash

                        new Usuario(NovoUsuario).save((err)=>{
                          if(err){
                                req.flash("error_msg", "Erro ao cadastrar usuário. ERRO :" + err)
                                res.redirect("/usuario/cadastro")
                            }else{
                                req.flash("success_msg", "Usuário cadastrado !")
                                res.redirect("/usuario/")
                                }
                            })
                    })
                })

                
            }
        })
        
    }
})


module.exports = router;