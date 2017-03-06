//testing-asincrono-spec.js
//requiere el modelo 
var modelos=require('../modelos/principal.js')
describe('Modelos Articulo',function () {

    //done === es un parametro que se usa solo cuando 
    //tienen que probar metodos asincronos
    it("deberia crear un articulo",function(){
        //permite acceder a las funciones que se declare
        modelos.sequelize.transaction(function(t){
            //t=transaccion que creo en la base 
                 crearOActualizar:(articulo,opciones)=>{
                //yo espero que pasen los parametros
                //del objeto a crear o actualizar
                if(typeof articulo.id==='undefined' || articulo.id===''){
                     //ejecutamos la logica crear un nuevo renglon
                     Articulo.create(articulo)
                     .then(funcion(articuloNuevo){
                         //yo espero que exito sea una funcion de callback
                         opciones.exito(articuloNuevo)
                     })   
                }
            }

        });
       modelos.Articulo.crearOActualizar({
           titulo:'articuloTesting'
           contenido:'nuevoTesting'
           usuario_id:1
       },{
           //le asignamos la funcion del callback
           exito:function(articuloNuevo){
               //esperamos que tenga un objeto de articulo creado
               expect(articuloNuevo).not.toBe(null);
               done();
           }
       })
    })
})
