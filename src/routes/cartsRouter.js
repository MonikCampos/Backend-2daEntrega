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
            error: "Unexpected server error - Try later, or contact your administrator",
            detalle: `${error.message}`
        });
    }
});

//La ruta /:cid devuelve el contenido del carro con un id específico
router.get( '/:cid', async(req, res) =>{
    let cid = req.params.cid;
    // validar que sea un id de mongo
    if (!isValidObjectId(cid)) {
        return res.status(400).json({error:`Please enter a valid ID Cart...!!!`})
    };
    res.setHeader('Content-Type','application/json');
    try {
        const Cart=await Carts.getCartById(cid, true); // true indica que queremos hacer populate
        if(!Cart){
            res.status(400).json({message:`There are no carts with ID ${cid}`});
        }
        return res.status(200).json({Cart});
    } catch (error) {
        return res.status(500).json({
            error: "Unexpected server error - Try later, or contact your administrator",
            detalle: `${error.message}`
        });
    }
});

//La ruta /:cid actualiza el carrito con un arreglo de productos 
router.put( '/:cid', async(req, res) =>{
    let cid = req.params.cid;
    let prodToCart = req.query.products; 

    if (!isValidObjectId(cid)) {
        return res.status(400).json({error: `Please enter a valid ID Cart...!!!`});
    };

    try {
        prodToCart = JSON.parse(prodToCart); // parsear prodToCart que se espera sea un JSON
    } catch (error) {
        return res.status(400).json({error: `The format of the products must be valid JSON.`});
    }

    // Verificar que prodToCart sea un arreglo y no esté vacío
    if (!Array.isArray(prodToCart) || prodToCart.length === 0) {
        return res.status(400).json({error: `Enter products to add...!!!`});
    };

    res.setHeader('Content-Type', 'application/json');
    try {
        const Cart = await Carts.putProductsInCart(cid, prodToCart);
        if (!Cart) {
            return res.status(400).json({message: `There are no carts with the ID ${cid}`});
        }
        return res.status(200).json({Cart});
    } catch (error) {
        return res.status(500).json({
            error: "Unexpected server error - Try later, or contact your administrator",
            detalle: `${error.message}`
        });
    }
});

//La Ruta api/carts/:cid/products/:pid modifica la cantidad de un producto del carrito 
router.put('/:cid/product/:pid/:qty', async(req,res)=>{
    let cid = req.params.cid;
    let pid = req.params.pid;
    let qty = req.params.qty;

    // validar que sean un id de mongo
    if (!isValidObjectId(pid)) {
        return res.status(400).json({error:`Please enter a valid id product...!!!`})
    };
    if (!isValidObjectId(cid)) {
        return res.status(400).json({error:`Please enter a valid id cart...!!!`})
    };
    //validar que la cantidad sea numérica y entera
    qty = parseInt(qty);
    if (!Number.isInteger(qty)) {
        return res.status(400).json({error: `The QUANTITY must be a whole number.`});
    }

    res.setHeader('Content-Type','application/json');
    try {
        const Cart=Carts.putQtyProductInCart(cid,pid,qty);
        return res.status(200).json({Cart});
    } catch (error) {
        console.log(error)
        return res.status(400).json({error: error.message});
    }
});

//La ruta RAÍZ POST crea un nuevo carrito
router.post('/', async (req,res)=>{
    let {id} = req.body
    // validacion que exista el id
    if (!id) {
        return res.status(400).json({Error:`You must enter a numerical ID`});
    }
    id=Number(id)
    if(isNaN(id)) {
        return res.status(400).json({Error:'The id must be a number'})
    }
    res.setHeader('Content-Type','application/json');
    try {
        let newCart=await Carts.addCart({...req.body}); 
        return res.status(200).json(newCart);
    } catch (error) {
        return res.status(500).json({
            error: "Unexpected server error - Try later, or contact your administrator",
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
        return res.status(400).json({error:`Please enter a valid id product...!!!`})
    };
    if (!isValidObjectId(cid)) {
        return res.status(400).json({error:`Please enter a valid id cart...!!!`})
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

//La ruta  /:cid elimina los productos del cart
router.delete("/:cid", async(req, res)=>{
    let cid = req.params.cid;
    // validar que sea un id de mongo
    if (!isValidObjectId(cid)) {
        return res.status(400).json({error:`Please enter a valid id cart...!!!`})
    };
    res.setHeader('Content-Type','application/json');
    try {
        //let cartEliminado=await Carts.deleteCart(cid) // elimina todo el carrito
        let cartEliminado=await Carts.deleteAllProductsFromCart(cid)
        return res.status(200).json(cartEliminado);
    } catch (error) {
        console.log(error)
        return res.status(400).json({error: error.message});
    }
});

//La Ruta /:cid/product/:pid elimina un producto del carro de compras 
router.delete('/:cid/product/:pid', async(req,res)=>{
    let cid = req.params.cid;
    let pid = req.params.pid;
    // validar que sean un id de mongo
    if (!isValidObjectId(pid)) {
        return res.status(400).json({error:`Please enter a valid id product...!!!`})
    };
    if (!isValidObjectId(cid)) {
        return res.status(400).json({error:`Please enter a valid id cart...!!!`})
    };
    res.setHeader('Content-Type','application/json');
    try {
        const Cart=Carts.deleteProductFromCart(cid,pid);
        return res.status(200).json({Cart});
    } catch (error) {
        console.log(error)
        return res.status(400).json({error: error.message});
    }
});