import fs  from 'fs';
import ProductManager from './productManagerFS.js';

export default class CartManager {
    #carts;
    #path;
    
    constructor() {
        this.#path="./src/data/carts.json";
        this.#carts = this.#readCartsInFile();
    }
    #newCartId() {
        let id = 1;
        if (this.#carts.length != 0)
            id=this.#carts[this.#carts.length-1].id+1;
        return id
    }
    #readCartsInFile () { 
        try{    
            if(fs.existsSync(this.#path)){  
                let data = fs.readFileSync(this.#path,'utf-8');    
                return JSON.parse(data);
            }
            console.log('No existe el archivo de carritos');
            return [] ;
        }catch(error){    
            console.log(`Error al leer el archivo de carritos, ${error}`);
            return [] ;
        }
    }
    #saveCartsInFile () { 
        try {
            fs.writeFileSync(this.#path ,JSON.stringify(this.#carts));
        } catch (error) {
            console.log("Se ha producido un error al guardar los datos en el archivo del carrito");
        }
    }
    createCart() {
        const newCart = {
            "id": this.#newCartId(),
            "products" : [],
        };
        this.#carts.push(newCart);
        this.#saveCartsInFile();
        return newCart;
    }
    addProductInCart(cid,pid) {
        let resp="";
        const p = new ProductManager();
        const producto =p.getProductsById(pid);
        const indexCart = this.#carts.findIndex((e)=> e.id === cid );
        
        if (indexCart !== -1){
                const productExist = this.#carts[indexCart].products.findIndex((e)=> e.id=== pid )
                if(producto.status && productExist === -1 ){
                    //El producto existe y no está en el carrito
                    this.#carts[indexCart].products.push({id: pid, quantity:1});
                    this.#saveCartsInFile();
                    resp= `Se agrego correctamente el producto id:${pid} al carrito id: ${cid}`;
                    return resp;
                }else{
                    if(productExist!==-1 && producto.status){
                        let cant=0;
                        //Ya estaba en el carrito, solo se incrementa la cantidad
                        ++this.#carts[indexCart].products[productExist].quantity;    
                        this.#saveCartsInFile();
                        resp= `Producto ${pid}: La cantidad fue actualizada en el carrito ${cid}.`;
                        return resp;
                    } else {
                        if(!producto.status)
                        throw new Error(`No se encontró el producto con id=${pid}`);
                    }
                }
        } else {
            throw new Error(`El carrito con id:${cid} no existe`);
        }
        
    }
    deleteCart(id) {  
        let resultado ="";
        // eliminar un carrito con su id
        let index = this.#carts.findIndex((p)=> p.id === id);
        if (index !== -1) {
            resultado = {
                Message: `*** Se eliminó el carrito id: ${id}`,
                Product: this.#carts[index] 
            }
            this.#carts = this.#carts.filter((e) => e.id != id );
            this.#saveCartsInFile();  
            return resultado; 
        } else {
            throw new Error(`No se encontró el carrito id: ${id} para eliminar`);
        }
    }
    getCarts(){
        //devuelve los carritos
        return this.#carts;
    }
    getCartsById(id){
        //devuelve el producto que coincide con el id
        const  product = this.#carts.find((p)=> p.id===id);
        if(product)
            return product;
        else
            throw new Error(`No se encuentra carrito con id: ${id}`);
    } 
}
