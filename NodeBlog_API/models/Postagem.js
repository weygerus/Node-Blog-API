const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Postagem = new mongoose.Schema({
    titulo: {
        type: String,
        require: true
    },
    slug: {
        type: String,
        require: true
    },
    descricao: {
        type: String,
        require: true
    },
    conteudo: {
        type: String,
        require: true
    },
    categoria: {
        type: Schema.Types.ObjectId,
        ref: 'categoria',
        require: true
    },
    data: {
        type: Date,
        default: Date.now()
    }
})

mongoose.model('Postagens', Postagem)