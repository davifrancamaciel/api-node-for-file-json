const port = 3011

const bodyParser = require('body-parser')
const express = require('express')
const server = express()
const allowCors = require('./cors')
const queryParser = require('express-query-int')

server.use(bodyParser.urlencoded({ extended: true }))
server.use(bodyParser.json())
server.use(allowCors)
server.use(queryParser())


server.listen(process.env.PORT || port, function () {
    console.log(`O backend esta rodando na porta ${port} .`)
})

module.exports = server
