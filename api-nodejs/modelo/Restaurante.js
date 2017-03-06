'use strict';
const conexion = require('../conexion/conexionbd')
const Sequelize = require('sequelize')


var Restaurante = conexion.sequelize.define('Restaurante', {
    id: {
        primaryKey: true,
        type: Sequelize.INTEGER,
        autoIncrement: true
    },
    nombre: Sequelize.TEXT,
    direccion: Sequelize.TEXT,
    ruc: Sequelize.TEXT,
    imagen:Sequelize.TEXT,
    precio:Sequelize.TEXT
}, {
        tableName: 'restaurante'
    });
module.exports.Restaurante = Restaurante;