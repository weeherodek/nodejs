const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Usuario = new Schema({
    nome: {type: String, required:true},
    sobrenome: {type: String, required:true},
    email:{type: String, required:true},
    usuario: {type: String, required:true},
    senha: {type: String, required:true},
    admin: {type: Boolean, default:true},
    data_criacao: {type: Date, default:Date.now}
})

mongoose.model("usuario",Usuario)