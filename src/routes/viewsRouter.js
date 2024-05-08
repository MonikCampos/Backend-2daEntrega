import { Router } from 'express';
import { productsModel } from '../dao/models/productsModel.js';
import { cartsModel } from '../dao/models/cartsModel.js';

export const router=Router();


router.get('/products', async (req,res)=>{    
    const products = await productsModel.find().lean();
    return res.render('products',{products});
});

router.get('/carts/:cid', async (req,res)=>{    
    const carts = await cartsModel.findById(req.params.cid).populate('products.id').lean();
    return res.render('carts',{carts});
});


router.get('/', async (req,res)=>{    
    const products = await productsModel.find().lean();
    return res.render('home',{products});
});

router.get('/realtimeproducts',async (req,res)=>{
    const products = await productsModel.find().lean();
    return res.render('realTimeProducts',{products});
});
