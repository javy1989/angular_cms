console.log('hola mundo');
var curso = 'node.js'
var duracion = '15.5'

//OBJETOS JAVASCRIPT
//OBJETO DE JAVASCRIPT => JSON
var persona = {
    nombre: "ricardo",
    edad: 7
}

//declarar objeto 
var person2 = new Object();
person2.nombre = "LAVERTO";
person2.edad = 40;

//declarar funciones  tracidicional

function sumar(a, b) {
    return a + b;
}

//segunda forma:funciones anonimas
var multiplicar = function (a, b) {
    return a * b;
}

console.log("1+2=" + sumar(1, 2));
console.log("2*2:" + multiplicar(2, 2));


function operacion(mifuncion, a, b) {
    return mifuncion(a, b);
}

var resultado = operacion(sumar, 1, 2)
console.log("resultado:" + resultado);