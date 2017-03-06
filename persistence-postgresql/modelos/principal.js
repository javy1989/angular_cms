//module.exports es un objeto que permite hacer visibles
// datos de una archivo
var Sequelize = require('sequelize')

//configurar la base de datos con sequelize
var sequelize = new Sequelize('servicio1', 'postgres', 'postgres', {
    dialect: 'postgres', //otros valores: postgres,mysql,mariadb
    host: 'localhost',
    port: '5432',
    //la propiedad solo es para sqlite
    //storage: __dirname + "/database.db",
    define: {
        timestamps: false,
        //desahabilita la convension  por defualt por nombre de las bd
        freezeTableName: true
    }
})

//sincrona 
//leer archivo
//ejecutamos la siguiente linea

//-- las operaciones en disco duro en node se hacen de manera asincronica
//callbacks
sequelize.authenticate()
    .then(function () {
        console.log('conexion ok')
    })
    .catch(function (err) {
        console.log('error al conectar:' + err)
    })
//---mapeo de las tablas con sequelize
//articulo 
var Articulo = sequelize.define("Articulo", {
    id: {
        //le indicamos al sequelize que las llave primaria  
        primaryKey: true,
        type: Sequelize.INTEGER,
        autoIncrement: true
    },
    //TIPO DE DATO DE LA COLUMNA que es texta
    titulo: {
        type: Sequelize.TEXT,
        validate: {
            //len=length rango de una cadena 
            len: {
                args: [5],
                msg: 'La longitud minima del titulo debe ser de 5 letras'
            },
            //validar implementado
            filtrarHecho: (titulo) => {
                //la funcion recibe el valor a validar 
                var palabras = ['palabra1', 'palabra2', 'palabra3']
                var encontradas = []
                //validamos el campo titulo tenga texto
                if (titulo !== null && titulo.length > 0) {
                    palabras.forEach(function (palabra) {
                        //si se encuentra la palabra
                        if (titulo.search(palabra) !== -1) {
                            //agregamos el elemento a una arreglo
                            encontradas.push(palabra)
                            
                        }
                    })
                }
                //si se encuentra palabras encotradas
                if (encontradas.length > 0 ) {
                    //lanzamos un error
                    throw new Error('No puede contener las palabras:' + encontradas)
                }
            }
        }
    },
    contenido: Sequelize.TEXT,
    fecha_creacion: Sequelize.DATE

}, {
        //asignar la tabla de la base que esta asociada en BD
        tableName: "articulos",
        getterMethods: {
            fecha: function () {
                //getDataValue me permite acceder a las columnas del modelo
                var fecha = this.getDataValue('fecha_creacion')
                //dia mes year
                var fechaFormato = fecha.getDate() + '-' + fecha.getMonth() + 1 + '-' + fecha.getFullYear()
                return fechaFormato
            }
        },
        classMethods:{
       
        }
    });

//----usuario--------
var Usuario = sequelize.define("Usuario", {
    id: {
        primaryKey: true,
        type: Sequelize.INTEGER
    },
    nombre: Sequelize.TEXT,
    email: Sequelize.TEXT,
    password: Sequelize.TEXT
}, {
        tableName: "usuarios"
    });
//------datos_usuario

var DatosUsuario = sequelize.define("DatosUsuario", {
    id: {
        primaryKey: true,
        type: Sequelize.TEXT
    },
    biografia: Sequelize.TEXT,
    fecha_registro: Sequelize.DATE
}, {
        tableName: "datos_usuario"
    })


//-------CATEGORIAS---------
var Categoria = sequelize.define("Categoria", {
    id: {
        primaryKey: true,
        type: Sequelize.INTEGER
    },
    nombre: Sequelize.TEXT
}, {
        tableName: "categorias"
    })


//-------------COMENTARIOS---------------------
var Comentario = sequelize.define("Comentario", {
    id: {
        primaryKey: true,
        type: Sequelize.INTEGER
    },
    comentario: Sequelize.TEXT
}, {
        tableName: "comentarios"

    })

//------MAPEO 1-N
Usuario.hasMany(Articulo, {
    //llave foranea 
    foreignKey: "usuario_id",
    //cuando obtengan un objeto usuario
    //pueden acceder a los articulos con usuario.articulos
    as: "articulos"
})
//relacion 1-N en relacion inversa
Articulo.belongsTo(Usuario, {
    foreignKey: "usuario_id",
    //el parametro as me permite
    as: "usuario"
})

Articulo.hasMany(Comentario, {
    foreignKey: "articulo_id",
    //as me permite obtener los comentarios del articulo
    // haciendo articulo.comentarios
    as: "comentarios"
})

//--------------MAPEO A N-N-------------
Articulo.belongsToMany(Categoria, {
    foreignKey: "articulo_id",
    as: "categorias",
    through: "categorias_articulos"
})


Categoria.belongsToMany(Articulo, {
    foreignKey: "categoria_id",
    as: "articulos",
    through: "categorias_articulos"
})
//-------------------------------------

//---------ejemplo mapeo 1-1

Usuario.hasOne(DatosUsuario, {
    foreignKey: "usuario_id",
    as: "datosUsuario"
})
//exportando el modelo de la tabla articulo 
module.exports.Comentario = Comentario
module.exports.Categoria = Categoria
module.exports.Articulo = Articulo
module.exports.Usuario = Usuario
module.exports.DatosUsuario = DatosUsuario
//creacion de transacciones
module.exports.sequelize=sequelize;