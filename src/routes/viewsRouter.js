import { Router } from 'express';
import ProductManager from '../dao/productManagerDB.js';
import CartManager from "../dao/cartManagerDB.js";


export const router=Router();
const productManager=new ProductManager();
const cartManager=new CartManager();

//Ruta para visualizar todos los productos o con un límite de visualización
router.get('/products',async(req,res)=>{  
    let { page } = req.query;
	if (!page) page = 1; 
    let {docs:payload, 
        totalPages, 
        hasPrevPage,  
        hasNextPage, 
        prevPage, 
        nextPage 
        } = await productManager.getAllPaginate(page)
    try {
        res.status(200).render("products", {
            payload, totalPages, hasPrevPage, hasNextPage, prevPage, nextPage
        })
    } catch (error) {
        res.status(500).json({error: error.message});
    }
})


router.get('/realtimeproducts',async (req,res)=>{
    const products = await productManager.getProducts();
    return res.render('realTimeProducts',{products});
});

router.get('/carts/:cid', async (req,res)=>{  
    let cid = req.params.cid;  
    const carts = await cartManager.getCartById(cid);
    if (carts) {
        return res.status(200).render('carts',{carts});
    } else {
        return res.status(404).json({ error: `There is no cart with the ID: ${cid}` });
    }
});