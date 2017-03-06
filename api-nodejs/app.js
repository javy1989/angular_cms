'use strict'
const express = require('express');
const bodyParser = require('body-parser')
const app = express()
const api = require('./routes')

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin','*');
    res.header('Access-Control-Allow-Methods','GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers','Content-Type');
    req.headers['if-none-match'] = 'no-match-for-this';
    next();
})
//habilitamos los parametros del tipo post para express 
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())
app.use('/api', api)
module.exports = app