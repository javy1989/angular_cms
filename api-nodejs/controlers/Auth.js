'use strict'

const User = require('../modelo/User')
const service=require('../services')
function signUp(req, res) {
    var email = req.body.email
    var userName = req.body.userName

    User.User.create({
        email: email,
        userName: userName
    })
        .then((user) => {
            res.status(200).send({ token: service.createToken(user)});
        })
        .catch((err) => {
            res.status(500).send({ message: `Error al ingresar el registro:${err}` });
        });
}

function singIn(req, res) {

}