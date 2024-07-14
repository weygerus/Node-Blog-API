const express = require('express')
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const session = require('express-session')
const flash = require('connect-flash')
const cors = require('cors');
const path = require('path')

const admin = require('./routes/admin')


const app = express()

// config

    // cors requisition config 
    app.use(cors())

    // Sessão 
    app.use(session({
        secret: "123456",
        resave: true,
        saveUninitialized: true
    }))
    app.use(flash())

    // Middleware
    app.use((req, res, next) => {
        res.locals.success_msg = req.flash("success_msg")
        res.locals.error_msg = req.flash("error_msg")
        next()
    })

    // Template Engine
    app.engine('handlebars', handlebars.engine({
        defaultLayout: 'main',
        runtimeOptions: {
            allowProtoPropertiesByDefault: true,
            allowProtoMethodsByDefault: true,
        }
    }))
    app.set('view engine', 'handlebars')

    // Body Parser
    app.use(bodyParser.urlencoded({extended: false}))
    app.use(bodyParser.json())

    // Public
    app.use(express.static(path.join(__dirname, 'public')))

    // Mongoose
    mongoose.Promise = global.Promise
    mongoose.connect("mongodb://localhost/blogApp").then(() => {
        console.log("Conectado ao Mongo!")
    }).catch((err) => {
        console.log("Erro ao se conectar com o Mongo: " + err)
    })


// Routes
app.use('/admin', admin)

app.get('/', (req, res) => {

    return res.status(200).json({ message: 'Bem vindo ao cadastro de publicações!' })
})

// App init
const Port = 3000

app.listen(Port, () => {
    console.log("Servidor inicializado!")
})