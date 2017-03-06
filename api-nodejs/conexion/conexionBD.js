'use strict'
const Sequelize = require('sequelize')
const config=require('../config')
var sequelize = new Sequelize(config.db, config.user, config.pwd, {
    dialect: config.dialect,
    host: config.host,
    port: config.portBD,
    define: {
        timestamps: false,
        freezeTableName: true
    }

});

sequelize.authenticate()
    .then(function () {
        console.log('conexion exitosa');
    })
    .catch(function (err) {
        console.log(err);
    });
module.exports.sequelize=sequelize; 