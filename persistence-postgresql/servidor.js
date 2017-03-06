const express = require('express')
const nunjucks = require('nunjucks')
//requerimos nuestros modulos
const modelos = require('./modelos/principal.js')

const bodyParser = require('body-parser')
const expressSession = require('express-session')

const session = expressSession({
    //secret lo usa el servidor para genera un valor aleatorio
    //que asigna a la cookie de sesion
    secret: 'cadena_aleatoria',
    //parametro es el nombre de la cookie de session
    key: "sessionServidor",
    //son para crear nueva session para el usuario
    resave: true,
    saveUninitialized: true,
    cookie: {
        //maxAge tiempo de duracion de un usaurio unidad en milisegundos
        //cookie de session dura 30 dias!! 
        maxAge: 1000 * 60 * 60 * 24 * 30
    }
})
//invocamos a la funcion de express para crear un servidor web
const app = express()
//asignamos la sesion al servidor express
app.use(session)
//habilitamos los parametros del tipo post para express 
app.use(bodyParser.urlencoded({ extended: false }))
//configuramos nunjucks sistema de templates
//__dirname=contiene la ruta de archivo actual
nunjucks.configure(__dirname + '/vistas', {
    //asignamos el servidor de express 
    express: app
})
//levantamos el servidor web

app.listen(8080, () => {
    console.log('corriendo server web')
});
//-------------------------middlewares------------
function validarPertenenciaArticulo(req, res, siguienteFuncion) {
    //accedemos al id del articulo que quieren editar
    var articuloId = req.params.articuloId

    //si dentro de la ruta no viene el parametro id del articulo
    //significa que esta en un metodo post
    if (typeof articuloId === "undefined") {
        //el metodo post que usamos para guardar un articulo
        //envia el id del articulo en una peticion post
        articuloId = req.body.id
        console.log('tomamos el id por el post')
    }    
    modelos.Articulo.find({
        where: {
            id: articuloId
        },
        include: [{
            model: modelos.Usuario,
            as: "usuario"
        }]
    }).then(function (articulo) {
        //se verifica que el articulo es el mismo que esta logueado
        if (articulo.usuario.id === req.session.usuarioLogueado.id) {
            // si el usuario tiene permisos
            siguienteFuncion()
        } else {
            //si el usuario no tiene permisos no se deja pasar
            res.send('no tienes permiso para editar el articulo' + articulo.id)
        }
    })
}
//agregar  la logica para los middlewares de express---
//es la siguiente funcion en el stack de middlewares
function validarSession(req, res, siguienteFuncion) {
    console.log('validando session de usuario')
    //protegemos rutas siempre  que este logueado 
    //usuarioLogueado variable creada para almacenar session
    //se tiene que usar keyword de javascript que se llama typeof
    if (typeof req.session.usuarioLogueado === 'undefined') {
        //si el usuario no se a logueado enviamos a login
        res.redirect('/login')
    } else {
        //si ya esta logueado
        siguienteFuncion()
    }

}
//definir rutas para mi proyecto
//expresion regular para hacer match para numeros [0-9]
app.get('/articulo/:articuloId([0-9]+)', (req, res) => {
    //req=request de la peticion web
    //res=response de la peticion web 
    //res.send('hola.....'
    //realizamos la primera consulta 
    var articuloId = req.params.articuloId
    modelos.Articulo.find({
        where: {
            id: articuloId
        },
        include: [{
            model: modelos.Comentario,
            as: 'comentarios'
        }, {
            model: modelos.Categoria,
            as: "categorias"
        }, {
            model: modelos.Usuario,
            as: "usuario"
        }]
    })
        .then(function (articulo) {
            //esto se ejecuta cuando encuentra algo
            res.render('articulo.html', {
                //asigno el objeto articulo a la propiedad
                articuloPrincipal: articulo
            })
        })
        .catch(function (err) {
            console.log('no hay nada' + err)
        })
});

app.get('/usuario', (req, res) => {
    modelos.Usuario.find({
        where: {
            id: 2,
        },
        include: [{
            model: modelos.Articulo,
            //parametro en mapeo de tabla
            as: 'articulos'
        }, {
            model: modelos.DatosUsuario,
            as: "datosUsuario"
        }]
    })
        .then(function (usuario) {
            res.render('usuario.html', {
                usuario: usuario
            })
        })
        .catch(function () {
            console.log('no se encontro')
        })
});

app.get('/blog', (req, res) => {
    //req.query acceso a todos los parametros en quey string via url
    //si no tiene el offset toma el 0
    var offset = req.query.offset
    modelos.Articulo.findAll({
        attributes: ['id', 'titulo'],
        order: '"id" asc',
        limit: 3,
        offset: offset
    })
        .then(function (articulos) {
            console.log('consulta de articulos')
            modelos.Categoria.findAll({
            }).then(function (categorias) {
                console.log('consulta de categorias')
                //articulos arreglo de objetos 
                res.render('blog.html', {
                    //articulos encontrados
                    articulos: articulos,
                    categorias: categorias
                })
            }).catch(function (err) {
                console.log('error en la consulta', err)
            })
        }).catch(function (err) {
            console.log('error en la consulta', err)
        })
})


//ruta para editar datosUsuario
app.get('/articulo/:articuloId([0-9]+)/editar', validarSession, validarPertenenciaArticulo, (req, res) => {
    var articuloId = req.params.articuloId
    var actualizado = req.query.actualizado
    modelos.Articulo.find({
        where: {
            id: articuloId
        }
    }).then(function (articulo) {
        res.render('articulo_editar.html', {
            articulo: articulo,
            actualizado: actualizado
        })

    }).catch(function (articulo) {
        console.log('error al cargar articulo')
    })

})

//en el formulario enviamos los datos como una peticion http-post
//se valida que la seccion exista para poder guardar el articulo
app.post('/guardar-articulo', validarSession, validarPertenenciaArticulo, (req, res) => {
    var errorValidacion = function (errores) {
        //este codigo cuando existe un error 
        //JSON.stringify muestra en representacion en forma de cadena 
        //de un objeto de javascripts
        console.log(JSON.stringify(errores))
        res.render('articulo_editar.html', {
            articulo: {
                id: id,
                titulo: titulo,
                contenido: contenido
            },
            errores: errores
        })
    }

    var id = req.body.id
    var titulo = req.body.titulo
    var contenido = req.body.contenido
    var usuario_id = req.body.usuario_id
    if (id === "") {
        console.log('creando nuevo articulo')
        //crear nuevo objeto en BD
        modelos.Articulo.create({
            //id:20,
            titulo: titulo,
            contenido: contenido,
            fecha_creacion: new Date,
            usuario_id: 1
        }).then(function (articuloNuevo) {
            //articulo nuevo nuevo objeto
            //patron post/redirect/response
            var url = `/articulo/${articuloNuevo.id}/editar?actualizado=true`
            res.redirect(url)
        }).catch(errorValidacion)
    } else {
        modelos.Articulo.find({
            where: {
                id: id
            }
        }).then(function (articulo) {
            //encontramos que vamos a actualizar
            //sobreescribimos los campos
            articulo.titulo = titulo
            articulo.contenido = contenido
            //actualiza los cambios para el objeto que encontramos
            articulo.save().then(function () {
                //res.send('cambios guardados')
                //patron post/redirect/get
                var url = `/articulo/${articulo.id}/editar?actualizado=true`
                //http redirect en express se hace con:
                res.redirect(url)
            }).catch(errorValidacion)
        }).catch(function (errores) {

        })

    }
})

//-----ruta para crear articulo
app.get("/articulo/crear", validarSession, (req, res) => {
    res.render("articulo_editar.html");
})

app.get("/articulo/:articuloId([0-9]+)/destruir", (req, res) => {
    var id = req.params.articuloId

    modelos.Articulo.find({
        where: {
            id: id
        }
    }).then(function (ariculo) {
        articulo.destroy().then(function () {
            res.send(`articulo destruido : ${articulo.id}`)
        })
    })
})


app.get('/login', (req, res) => {
    res.render("login.html")
})

app.post('/autentificar', (req, res) => {
    //parametros del post los toman del body
    var email = req.body.email
    var password = req.body.password

    modelos.Usuario.find({
        where: {
            //es equivalente hacer un sql con where y and 
            email: email,
            password: password
        }
    }).then(function (usuarioEncontrado) {

        //USUARIO NO EXISTE o credenciales no validades
        if (usuarioEncontrado === null) {
            res.render('login.html', {
                error: true
            })
        } else {
            req.session.usuarioLogueado = {
                id: usuarioEncontrado.id,
                email: usuarioEncontrado.email
            }
            res.send('usuario logeado correctamente')
        }
    })

})