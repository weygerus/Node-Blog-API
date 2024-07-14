const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

require('../models/Postagem')
const Postagem = mongoose.model('Postagens')

require('../models/Categoria')
const Categoria = mongoose.model('Categorias')

router.get('/postagens', async(req, res) => {

    try {

        Postagem.find().lean().sort({order: 'desc'})
            .then((postagens) => {

                console.log(`Publicações listadas com sucesso!`)

                return res.status(200).json({
                    message: 'Publicações listadas com sucesso!',
                    postagens: [postagens]
                })
            })
            .catch((err) => {

                return res.status(400).json({
                    message: `Houve um erro ao listar as publicacões: ${err}`
                })
            });
    }
    catch(err) {

        return res.status(500).json({
            message: `Houve um erro em nosso servidor, tente novamente mais tarde!`
        })
    }  
})

router.get('/postagens/getById/:id', (req, res) => {

    try {

        const postId = req.params.id

        Postagem.findOne({_id: postId})
        .then((postagem) => {
    
            console.log('Publicação encontrada com sucesso!')
    
            return res.status(200).json({
    
                message: 'Publicação encontrada com sucesso!',
                data: postagem
            })
        })
        .catch((err) => {
    
            console.log(`Houve um erro ao buscar a publicação! Message: ${err}`)
    
            return res.status(400).json({
    
                message: `Houve um erro ao buscar a publicação! Message: ${err}`
            })
        })
    }
    catch(err) {

        return res.status(500).json({

            message: `Houve um erro em nosso servidor, tente novamente mais tarde!`,
            errorMessage: `${err}`
        })
    }
})

router.post('/postagens/nova', async (req, res) => {

    const category = await Categoria.findOne({ nome: req.body.categoria })

    if (category == null) {

        return res.status(400).json({

            message: 'A categoria da publicação não existe!'
        })
    }
    else {
        
        const newPost = new Postagem({
            titulo: req.body.titulo,
            slug: req.body.slug,
            descricao: req.body.descricao,
            conteudo: req.body.conteudo,
            categoria: category._id
        })

        if (newPost.titulo == null || newPost.titulo.length < 3) {

            console.log('O nome da publicação é inválido!')

            return res.status(400).json({

                message: 'O nome da publicação é inválido!'
            })
        }

        const postNameExists = await Postagem.findOne({ titulo: req.body.titulo })

        if (postNameExists != null) {

            console.log('Já existe uma publicação com esse nome!')

            return res.status(400).json({

                message: 'Já existe uma publicação com esse nome!'
            })
        }

        const savedPost = await newPost.save()

        return res.status(200).json({

            message: 'Publicação cadastrada com sucesso!',
            data: savedPost
        })
    }
})

// Categorias

async function getCategoryByName(categoryName) {

    Categoria.findOne({ nome: categoryName })
    .then((category) => {

        console.log('Categoria encontrada com sucesso!')

        return category.nome
    })
    .catch((err) => {

        console.log('Houve um erro ao buscar a categoria!')

        return null
    })
}

router.get('/categorias/getCategories', (req, res) => {

    try {
        Categoria.find().lean().sort({ order: 'desc' })
        .then((categorias) => {
    
            console.log('Categorias encontradas com sucesso!')
    
            return res.status(200).json({
                message: 'Categorias encontradas com sucesso!',
                data: categorias
            })
        })
        .catch((err) => {
    
            console.log(`Houve um erro ao buscar as categorias: ${err}`)
    
            return res.status(400).json({
    
                message: `Houve um erro ao buscar as categorias!`,
                error: `${err}`
            })
        })
    }
    catch(err) {

        return res.status(500).json({

            message: `Houve um erro em nosso servidor, tente novamente mais tarde!`,
            errorMessage: `${err}`
        })
    }
})

router.get('/categorias/getById/:id', (req, res) => {

    const categoryId = req.params.id

    try {

        Categoria.findOne({ _id: categoryId })
        .then((category) => {

            console.log('Categoria encontrada com sucesso! data: ', category)

            return res.status(200).json({

                message: `Categoria encontrada com sucesso!`,
                data: category
            })
        })
        .catch((err) => {

            console.log(`Houve um erro ao buscar a categoria: ${err}`)

            return res.status(400).json({

                message: `Houve um erro ao buscar a categoria!`,
                error: `${err}`
            })
        })
    }
    catch(err) {

        return res.status(500).json({

            message: `Houve um erro em nosso servidor, tente novamente mais tarde!`,
            errorMessage: `${err}`
        })
    }
})

router.post('/categorias/nova', async (req, res) => {

    if (req.body.nome == null || req.body.nome.length < 3) {

        console.log('O nome da categoria é inválido!')

        return res.status(400).json({

            message: 'O nome da categoria é inválido!'
        })
    }

    const newCategory = new Categoria({
        nome: req.body.nome,
        slug: req.body.slug
    })

    const categoryExists = await Categoria.findOne({ nome: req.body.nome })

    console.log('Teste de busca de categoria por nome: ', categoryExists)

    if (categoryExists != null) {

        console.log('Essa categoria já existe!')

        return res.status(400).json({

            message: 'Essa categoria já existe!'
        })
    }
    else {

        const savedCategory = await newCategory.save()

        return res.status(200).json({

            message: 'Categoria registrada com sucesso!',
            data: savedCategory
        })
    }
})

router.post('/categorias/nova', async(req, res) => {

    try {

        const newCategory = new Categoria(req.body)

        if (newCategory.nome == null || newCategory.nome.length < 2) {

            console.log('Nome inválido!')

            return res.status(400).json({

                message: 'Nome de categoria inválido, tente outro nome!'
            })
        }

        const categoryExists = await Categoria.findOne({ nome: req.body.nome })

        if (categoryExists != null) {

            console.log('Categoria já existe!')

            return res.status(400).json({

                message: 'Essa categoria já existe!'
            })
        }

        const savedCategory = await newCategory.save()

        console.log('Teste do retorno de save da categoria: ', savedCategory)

        return res.status(200).json({

            message: 'Categoria cadastrada com sucesso!',
            data: newCategory
        })

    }
    catch(err) {

    }
})

module.exports = router;