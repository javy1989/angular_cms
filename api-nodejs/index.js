'use strict'
const app=require('./app')
const config=require('./config')
//levantando servidor
app.listen(config.port, () => {
    console.log(`api rest corriendo puerto ${config.port}`)
});


