import fs  from 'fs';

export default class ProductManager {
    #products;
    #path;
    
    constructor() {
        this.#path="./src/data/products.json";
        this.#products = this.#readProductsInFile();
    }

    #readProductsInFile () { 
        try{    
            if(fs.existsSync(this.#path)){  
                let data = fs.readFileSync(this.#path,'utf-8');    
                return JSON.parse(data);
            }
            console.log('No existe el archivo de productos');
            return [] ;
        }catch(error){    
            console.log(`Error al leer el archivo de productos, ${error}`);
            return [] ;
        }
    }

    #saveProductsInFile () { 
        try {
            fs.writeFileSync(this.#path ,JSON.stringify(this.#products));
        } catch (error) {
            console.log("Se ha producido un error al guardar los datos en el archivo");
        }
    }

    addProduct({title, description, price, status=true, code, stock, category, brand, thumbnail=[]}) {  
        let resultado ="";
        if (!title || !description || !price || !code || !stock || !category || !brand)
            throw new Error(`Faltan datos requeridos: Title:${title} - Description:${description} - Code:${code} - Price:${price} - Stock:${stock} - Category:${category} - Brand:${brand}`);       
        //validar que el codigo no se repita
        const productExist = this.#products.some((p=> p.code == code));
        if(productExist) 
            throw new Error( `El código ${code} ya se encuentra registrado, el producto no se agregó`);
        //id que se incremente 
        let id=1;
        if(this.#products.length>0)
            id=this.#products[this.#products.length -1].id +1;    
        
        const newProduct = {
            id,
            title,
            description,
            price,
            status,
            code,
            stock, 
            category,
            brand,      
            thumbnail
        };
        //guardar la información en el array
        this.#products.push(newProduct);
        //guardar la información en el archivo
        this.#saveProductsInFile();
        resultado = {
            Message: `*** Producto ${id} se agregó exitosamente`,
            Product: newProduct 
        }
        return resultado;
    }       
    updateProduct(id, newFields){
        let resultado ="";
        // modificar un producto con su id
        let index = this.#products.findIndex((p)=> p.id === id);
        if (index !== -1) {
            const {id, ...rest}=newFields;
            this.#products[index]={...this.#products[index], ...rest};           
            this.#saveProductsInFile();
            resultado = {
                Message: `*** Se actualizó el producto id: ${this.#products[index].id}`,
                Product: this.#products[index] 
            }
            return resultado;            
            }else{    
                throw new Error(`No se encontró el producto id: ${id} para modificar`);   
            }  
    }
    deleteProduct(id) {  
        let resultado ="";
        // eliminar un producto con su id
        let index = this.#products.findIndex((p)=> p.id === id);
        if (index !== -1) {
            resultado = {
                Message: `*** Se eliminó el producto id: ${id}`,
                Product: this.#products[index] 
            }
            this.#products = this.#products.filter((e) => e.id != id );
            this.#saveProductsInFile();  
            return resultado; 
        } else {
            throw new Error(`No se encontró el producto id: ${id} para eliminar`);                            
        }
    }

    getProducts(limit = 0){
        //devuelve los productos
        //limit es un parametro query que se envia desde el navegador
        limit = Number(limit);
        if (limit > 0)
            return  this.#products.slice(0, limit);   
        return this.#products;
    }

    getProductsById(id){
        let status =false;
        let resp=`No se encuentra producto con id: ${id}`;
        //devuelve el producto que coincide con el id
        const  product = this.#products.find((p)=> p.id===id);
        if(product){
            status=true;
            resp=product;
        }
        return {status,resp};        
    } 
}