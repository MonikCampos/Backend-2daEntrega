import { Router } from 'express';
import { productsModel } from '../dao/models/productsModel.js';

export const router=Router();


router.get('/products', async (req,res)=>{    
    const products = await productsModel.find().lean();
    return res.render('products',{products});
});

router.get('/', async (req,res)=>{    
    const products = await productsModel.find().lean();
    return res.render('home',{products});
});

router.get('/realtimeproducts',async (req,res)=>{
    const products = await productsModel.find().lean();
    return res.render('realTimeProducts',{products});
});
