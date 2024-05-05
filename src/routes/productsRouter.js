import { Router } from 'express';
import ProductManager from '../dao/productManagerDB.js';
import { isValidObjectId } from 'mongoose';

export const router=Router();

const Products=new ProductManager();

//Ruta para visualizar todos los productos o con un límite de visualización
router.get("/", async(req, res)=>{
    try {
        let product = await Products.getProducts();
        res.setHeader('Content-Type','application/json');
        res.status(200).json({Products: product});
    } catch (error) {
        res.setHeader('Content-Type','application/json');
        res.status(500).json({error: error.message});
    }
});

//Ruta para visualizar solo uno de los productos por su id
router.get("/:pid", async(req, res)=>{
    let pid=req.params.pid
    // validar que sea un id de mongo
    if (!isValidObjectId(pid)) {
        res.setHeader('Content-Type','application/json');
        return res.status(400).json({error:`Ingrese un id válido...!!!`})
    }
    
    try {
        let product = await Products.getProductsBy({_id:pid});
        if(!product){
            res.status(400).json({message:`No existen products con id ${pid}`});
        }
        res.status(200).json({Products: product});
    } catch (error) {
        console.log(error);
        return res.status(400).json({error: error.message});
    }
})

router.post("/", async(req, res)=>{
    let {title, description, price, status, code, stock, category, brand, thumbnail} = req.body
    // validacion que exista
    if (!title || !description || !price || !code || !stock || !category || !brand) {
        res.setHeader('Content-Type','application/json');
        res.status(400).json({Error:`Debe ingresar todos los campos requeridos`});
    }
    // validación que  el codigo sea único se hace en la clase
    // validacion que el precio sea numerico
    price=Number(price)
    if(isNaN(price)) {
        return res.status(400).json({Error:'El precio debe ser número'})
    }
    //validacion que el estock sea entero
    stock=Number(stock)
    if (!Number.isInteger(stock)) {
        return res.status(400).json({Error:'La cantidad del stock debe ser un numero entero'})
    }
    try {
        let newProduct=await Products.addProduct({...req.body}); 
        res.setHeader('Content-Type','application/json');
        return res.status(200).json(newProduct);
    } catch (error) {
            return res.status(500).json({
                error: "Error inesperado en el servidor - Intente más tarde, o contacte a su administrador",
                detalle: `${error.message}`
            });
        
    }
})

router.put("/:pid", async(req, res)=>{
    let pid=req.params.pid
    // validar que sea un id de mongo
    if (!isValidObjectId(pid)) {
        res.setHeader('Content-Type','application/json');
        return res.status(400).json({error:`Ingrese un id válido...!!!`})
    }
    try {
        let productModificado=await Products.updateProducts({_id:pid}, req.body);
        res.setHeader('Content-Type','application/json');
        return res.status(200).json(productModificado);
    } catch (error) {
        console.log(error);
        return res.status(400).json({error: error.message});
    }
})

router.delete("/:pid", async(req, res)=>{
    let pid=req.params.pid
    // validar que sea un id de mongo
    if (!isValidObjectId(pid)) {
        res.setHeader('Content-Type','application/json');
        return res.status(400).json({error:`Ingrese un id válido...!!!`})
    }
    try {
        let productEliminado=await Products.deleteProducts(pid);
        res.setHeader('Content-Type','application/json');
        return res.status(200).json(productEliminado);
    } catch (error) {
        console.log(error);
        return res.status(400).json({error: error.message});
    }
})

