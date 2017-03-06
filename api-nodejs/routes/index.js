'use strict'

const express=require('express')
const productController=require('../controlers/Restaurante')
const api=express.Router()
//peticion de busca todos
api.get('/restaurante', productController.getProducts);
api.get('/restaurante/:id',productController.getProduct);
api.post('/restaunrante',productController.saveProduct);
api.put('/restaurante/:id',productController.updateProduct);
api.delete('/restaurante/:id',productController.deleteProduct); 

module.exports=api