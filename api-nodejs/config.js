module.exports={
    port:process.env.PORT || 8080,
    db:process.env.POSTGRESQL || 'servicio2',
    user:process.env.USER || 'postgres',
    pwd:process.env.PWD || 'postgres',
    dialect:process.env.DIALECT || 'postgres',
    host:process.env.HOST || 'localhost',
    portBD:process.env.PORTBD || '5432',
    SECRET_TOKEN:'miclavetokens'
}