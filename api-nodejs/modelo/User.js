'use strict';
const conexion = require('../conexion/conexionbd')
const Sequelize = require('sequelize')
const bcrypt = require('bcrypt-nodejs')

var User = conexion.sequelize.define('User', {
    id: {
        primaryKey: true,
        type: Sequelize.INTEGER,
        autoIncrement: true
    },
    email: {
        type: Sequelize.TEXT,
        set: function (val) {
            this.setDataValue('email', val.toLowerCase());
        }

    },
    user: Sequelize.TEXT,
    nombre: Sequelize.TEXT,
    avatar: Sequelize.TEXT,
    password: Sequelize.TEXT,
    password_confirm: Sequelize.TEXT,
    password_digest: Sequelize.TEXT,
    singupDate: {
        type: Sequelize.DATE,
        defaultValue: Date.now()
    },
    lastLogin: Sequelize.Date
}, {
        tableName: 'user',
        freezeTableName: true,
        instanceMethods: {
            authenticate: function (value) {
                if (bcrypt.compareSync(value, this.password)) {
                    return this;
                } else {
                    return false;
                }
            }
        }
    });

var hasSecurePassword = function (user, options, callback) {

    bcrypt.hash(user.get('password'), 10, function (err, hash) {
        if (err) return callback(err);
        user.set('password_digest', hash);
        return callback(null, options);
    });
}

var gravatar = function () {
    if (!this.email) return 'https://gravatar.com/avatar/?s=200&d=retro'
    const md5=crypto.createHash('md5').update(this.email).digest('hex');
    return `https://gravatar.com/avatar/${md5}?s=200&d=retro`
}
User.beforeCreate(function (user, options, callback) {
    user.email = user.email.toLowerCase();
    if (user.password) {
        hasSecurePassword(user, options, callback);
    } else {
        return callback(null, options);
    }
});

User.beforeUpdate(function (user, options, callback) {
    user.email = user.email.toLowerCase();
    if (user.password)
        hasSecurePassword(user, options, callback);
    else
        return callback(null, options);
})

module.exports.User = User;