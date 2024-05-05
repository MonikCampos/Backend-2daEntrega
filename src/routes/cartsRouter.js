import { isValidObjectId } from 'mongoose';
import { Router } from 'express';
import CartManager from "../dao/cartManagerDB.js";

export const router=Router();
const Carts=new CartManager();
//La ruta RAIZ GET devuelve todos los carritos
router.get( '/', async(req, res) =>{
    res.setHeader('Content-Type','application/json');
    try {
        const Cart = await Carts.getCarts();
        return res.status(200).json({Cart});
    } catch (error) {
        return res.status(500).json({
            error: "Error inesperado en el servidor - Intente más tarde, o contacte a su administrador",
            detalle: `${error.message}`
        });
    }
});

//La ruta /:cid devuelve el contenido del carro con id :
router.get( '/:cid', async(req, res) =>{
    let cid = req.params.cid;
    // validar que sea un id de mongo
    if (!isValidObjectId(cid)) {
        return res.status(400).json({error:`Ingrese un id válido...!!!`})
    };
    res.setHeader('Content-Type','application/json');
    try {
        const Cart=await Carts.getCartById(cid);
        if(!Cart){
            res.status(400).json({message:`No existen carritos con id ${cid}`});
        }
        return res.status(200).json({Cart});
    } catch (error) {
        return res.status(500).json({
            error: "Error inesperado en el servidor - Intente más tarde, o contacte a su administrador",
            detalle: `${error.message}`
        });
    }
});

//La ruta RAÍZ POST crea un nuevo carrito
router.post('/', async (req,res)=>{
    let {id} = req.body
    // validacion que exista el id
    if (!id) {
        return res.status(400).json({Error:`Debe ingresar un id nmerico`});
    }
    id=Number(id)
    if(isNaN(id)) {
        return res.status(400).json({Error:'El id debe ser número'})
    }
    res.setHeader('Content-Type','application/json');
    try {
        let newCart=await Carts.addCart({...req.body}); 
        return res.status(200).json(newCart);
    } catch (error) {
        return res.status(500).json({
            error: "Error inesperado en el servidor - Intente más tarde, o contacte a su administrador",
            detalle: `${error.message}`
        });
    }
});

//La Ruta /:cid/product/:pid agrega un producto al carro de compras 
router.post('/:cid/product/:pid', async(req,res)=>{
    let cid = req.params.cid;
    let pid = req.params.pid;
    // validar que sean un id de mongo
    if (!isValidObjectId(pid)) {
        return res.status(400).json({error:`Ingrese un id de producto válido...!!!`})
    };
    if (!isValidObjectId(cid)) {
        return res.status(400).json({error:`Ingrese un id de carrito válido...!!!`})
    };
    res.setHeader('Content-Type','application/json');
    try {
        const Cart=Carts.addProductsToCart(cid,pid);
        return res.status(200).json({Cart});
    } catch (error) {
        console.log(error)
        return res.status(400).json({error: error.message});
    }
});

router.delete("/:cid", async(req, res)=>{
    let cid = req.params.cid;
    // validar que sea un id de mongo
    if (!isValidObjectId(cid)) {
        return res.status(400).json({error:`Ingrese un id válido...!!!`})
    };
    res.setHeader('Content-Type','application/json');
    try {
        let cartEliminado=await Carts.deleteCart(cid)
        return res.status(200).json(cartEliminado);
    } catch (error) {
        console.log(error)
        return res.status(400).json({error: error.message});
    }
})