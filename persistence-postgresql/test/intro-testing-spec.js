describe("calculadora",function () {
    //antes del test (it)
  beforeEach(function(){
      console.log('antes del test')
  })  
  it("deberia sumar",function(){
      var suma=1+3;
      expect(suma).toBe(4);
  })  

//despues 
afterEach(function(){
    console.log('despues del test')
   })
})