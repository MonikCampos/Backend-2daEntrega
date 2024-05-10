import express  from 'express';
import mongoose from 'mongoose';
import {Server} from 'socket.io';
import { engine } from 'express-handlebars';

import { router as productsRouter } from "./routes/productsRouter.js"
import { router as cartsRouter } from "./routes/cartsRouter.js";
import { router as viewsRouter } from "./routes/viewsRouter.js";
import __dirname from "./utils.js";
//import ProductManager from "./dao/productManagerDB.js";
import { productsModel } from './dao/models/productsModel.js';

const port=8080;
const app=express();

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static(__dirname +  '/public')); //Para que se puedan ver las imagenes y estilos

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/views');

//rutas
app.use("/", viewsRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);




//el servidor escucha en el puerto 8080
const expressServer=app.listen(port, ()=>console.log(`Server corriendo en puerto ${port}`))
const socketServer = new Server(expressServer);

socketServer.on('connection', async (socket)=>{   
    //const products = p.getProducts();    
    const products = await productsModel.find().lean();
    socket.emit('Products', products); 
    
    socket.on('nuevoProducto', async producto =>{        
        //console.log({producto});
        //const result =  p.addProduct(producto);                  
        const result = await productsModel.create(producto);
        if (result.producto)
            socket.emit('Products', result.producto);
    });
});

const dbConnection = async () => {
    try {
        await mongoose.connect(
            "mongodb+srv://monikcampos:merce123@cluster0.yk0dhdd.mongodb.net/",
            {
                dbName:"ecommerce"
            }
        );
        console.log('Connected to MongoDB');
    } catch (error) {
        console.log(error);
    }
}
dbConnection();

