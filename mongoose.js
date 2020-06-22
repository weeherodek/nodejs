const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/teste', {useNewUrlParser: true, useUnifiedTopology: true});

const db = mongoose.connection.then(() =>{
    console.log("Mongo conectado com sucesso !");
}).catch((err) =>{
    console.log("Erro ao conectar ao MongoDB:" + err);
});

const usuarioSchema = new mongoose.Schema({
    nome : { type: String, require: true},
    sobrenome : { type: String, require: true},
    senha: { type: String, require: true},
    email : { type: String, require: true},
    dataCadastro : { type: Date, default: Date.now}
});

const Usuario = mongoose.model('Usuario',usuarioSchema)

const usuario = new Usuario({
    nome: "Philipe",
    sobrenome: "Herodek Neto",
    senha: "Herodek10",
    email: "herodek_10@hotmail.com",
})

const usuario2 = new Usuario({
    nome: "Felipe",
    sobrenome : "Neto",
    senha : "Neto10",
    email: "neto10@hotmail.com"
})