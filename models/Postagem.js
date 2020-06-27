const mongoose = require('mongoose')
const Schema = mongoose.Schema

require("../models/Categoria")

const Categoria = mongoose.model("categoria")

const Postagem = new Schema({
    titulo : {type: String, required:true},
    slug : {type: String, required:true},
    categoria: {type: Schema.Types.ObjectId, ref:"categoria", required:true},
    descricao : {type: String},
    conteudo: {type: String, required:true},
    data_publicacao : {type:Date, default:Date.now()},
    autor : {type: String, required:true}
})

mongoose.model("postagem",Postagem)