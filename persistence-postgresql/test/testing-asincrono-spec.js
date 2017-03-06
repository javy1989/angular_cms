//testing-asincrono-spec.js
//requiere el modelo 
var modelos=require('../modelos/principal.js')
describe('Modelos Articulo',function () {

    //done === es un parametro que se usa solo cuando 
    //tienen que probar metodos asincronos
    it("deberia encontrar un articulo",function(){
        //vamos a comprobrar si el metodo si funciona
        modelos.Articulo.find({
            where:{
                id:1
            }
        }).then(function(articulo){
            //usamos un assertion
            //que usa 2 matchers
            //esparamo que el articulo no venga vacio 
            expect(articulo).not.toBe(null);
            console.log('test termino')
            //la invocacion de done, me permite indicarle 
            //a jasmine que el test asincrono ya termino
            done()
    }).catch(function(errores){
        //se ejecuta error
        //formamos otro assertion que espera que no aya errores ==null
        expect(errores).toBe(null)
    })
    })
    console.log('llegamos al final del archivo')
})
