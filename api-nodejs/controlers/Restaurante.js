'user strict'
const Restaurante = require('../modelo/Restaurante')

function getProduct(req, res) {
    var id = req.params.id;
    Restaurante.Restaurante.find({
        where: {
            id: id
        }
    }).then((restaurante) => {
        //console.log(restaurante);
        if (restaurante === null) {
            return res.status(404).send({ message: 'No existe el registro' });
        }
        return res.status(200).send({restaurante});
    }).catch((err) => {
        console.log(err);
    });
}

function getProducts(req, res) {
    Restaurante.Restaurante.findAll({})
        .then((restaurantes) => {
            if (restaurantes.length === 0) {
                return res.status(404).send({ message: 'No existe el registro' });
            }
            return res.status(200).send({restaurantes})
        })
        .catch((err) => {
            return res.status(500).send({ message: `error al consultar todos ${err}` });
        });
}

function saveProduct(req, res) {
    var nombre = req.body.nombre;
    var direccion = req.body.direccion;
    var ruc = req.body.ruc;
    Restaurante.Restaurante.create({
        nombre: nombre,
        direccion: direccion,
        ruc: ruc
    }).
        then((newRest) => {
            res.status(200).send({ respuesta: newRest,status:'ok' })
        }).catch((err) => {
            res.status(500).send({ message: `Error al salvar en la BD:${err}` });
        });
}
function updateProduct(req, res) {
    let id = req.params.id;
    Restaurante.Restaurante.find({
        where: {
            id: id
        }
    }).then((actualizar) => {
        if (actualizar === null) {
            return res.status(404).send({ message: 'Registro no existe' });
        }

        actualizar.nombre = req.body.nombre
        actualizar.direccion = req.body.direccion
        actualizar.ruc = req.body.ruc
        actualizar.save()
            .then((objeto) => {
                return res.status(200).send({ message: 'Registro actualizado' });
            })
            .catch((err) => {
                return res.status(500).send({ message: `Error en la actualizacion: ${err}` });
            });
    }).catch((err) => {
        return res.status(500).send({ message: 'Registro no se pudo encontrar' });
    });
}

function deleteProduct(req, res) {
    var id = req.params.id;
    Restaurante.Restaurante.find({
        where: {
            id: id
        }
    }).then((eliminar) => {
        if (eliminar === null) {
            return res.status(404).send({ message: 'Registro no existe' });
        }
        eliminar.destroy((objeto) => {
        }).then((exito) => {
            return res.status(200).send({ message: 'Registro eliminado' });
        }).catch((err) => {
            return res.status(500).send({ message: `Error al eliminar el registro: ${err}` });
        });

    }).catch((err) => {
        return res.status(500).send({ message: `Error al buscar el resgistro: ${err}` });
    });
}


module.exports = {
    getProduct,
    getProducts,
    saveProduct,
    updateProduct,
    deleteProduct
}



