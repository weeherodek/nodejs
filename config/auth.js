const localStrategy = require('passport-local').Strategy
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

require('../models/Usuario')

const Usuario = mongoose.model("usuario")

module.exports = function(passport){

    passport.use(new localStrategy({ usernameField:'email', passwordField:'senha'},(email,senha,done)=>{
        
        Usuario.findOne({email:email}).then((usuario)=>{
            if(!usuario){
                return done(null,false,{message: "Conta não encontrada !"})
            }
            bcrypt.compare(senha,usuario.senha,(err,success)=>{
                if(success){
                    return done(null,usuario)
                }else{
                    return done(null,false, {message:"Senha incorreta !"})
                }

            })
        }).catch((err)=>{

        })


    }))

    passport.serializeUser((usuario,done)=>{
        done(null,usuario.id)
    })

    passport.deserializeUser((id,done)=>{
        Usuario.findById(id,(err,usuario)=>{
            done(err,usuario)
        })
    })

}

