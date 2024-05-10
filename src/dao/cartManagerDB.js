import { cartsModel } from "./models/cartsModel.js";
import { productsModel } from "./models/productsModel.js ";

export default class CartManager {
    
    async getCarts() {
        return await cartsModel.find().lean();
    }
    
    async getCartById(cartId, populate = false) {
        if (populate) {
            //return await cartsModel.findById(cartId).populate({ path: 'product', options: { strictPopulate: false } }).lean();
            return await cartsModel.findById(cartId).populate('products.id').lean();
        } else {
            return await cartsModel.findById(cartId).lean();
        }
    }
    
    async putProductsInCart(idCart, prodToCart) {
        try {
            let cart = await cartsModel.findById(idCart);
            if (!cart) {
                return `Cart with id ${idCart} not found`;
            }
            // Actualiza los productos en el carrito
            cart.products = prodToCart;
            await cart.save();
            return 'Cart updated with new products';
            //return await cartsModel.updateOne({_id:idCart}, prodToCart)
        } catch (error) {
            console.error(error);
            return 'Error updating cart';
        }
    }

    async putQtyProductInCart(idCart, idProduct, qty) {
        try {
            let cart = await cartsModel.findById(idCart);
            if (!cart) {
                return `Cart with id ${idCart} not found`;
            }
            // Encuentra el producto en el carrito
            let productInCart = cart.products.find(p => p.id.toString() === idProduct);
            if (productInCart) {
                productInCart.quantity = qty; // Actualiza la cantidad del producto
            } else {
                return 'Product not found in cart';
            }
            await cart.save();
            return 'Product quantity updated';
        } catch (error) {
            console.error(error);
            return 'Error updating product quantity in cart';
        }
    }

    async addCart() {
        //return await cartsModel.create();
        let carrito=await cartsModel.create({products:[]})
        return carrito.toJSON()
    }
    async addProductsToCart(idCart, idProduct) {
        try {
            //Verifico que existan los productos y carrito
            let searchCart = await cartsModel.findById(idCart);
            if (!searchCart) {
                return `Cart with id ${idCart} not found`;
            }
            let searchProduct = await productsModel.findById(idProduct);
            if (!searchProduct) {
                return `Product with id ${idProduct} not found`;
            }
            
            //Busco producto en el carrito
            let productInCart = searchCart.products.find(p => p.id.toString() === idProduct);
            if (productInCart) {
                //Existe y se incrementa la cantidad
                productInCart.quantity++;
            } else {
                //No existe, se agrega un nuevo producto
                searchCart.products.push({ id: idProduct });
            }
            await searchCart.save();
            return 'Product added to cart';
        } catch (error) {
            console.error(error);
        }
    }
    
    async deleteAllProductsFromCart(idCart) {
        try {
            let searchCart = await cartsModel.findById(idCart);
            if (!searchCart) {
                return `Cart with id ${idCart} not found`;
            }
            // Elimina todos los productos del carrito
            searchCart.products = [];
            await searchCart.save();
            return 'All products were removed from the cart';
        } catch (error) {
            console.error(error);
            return 'Error removing products from cart';
        }
    }

    async deleteCart(cartId) {
        return await cartsModel.deleteOne({ _id: cartId });
    }

    async deleteProductFromCart(idCart, idProduct) {
        try {
            let searchCart = await cartsModel.findById(idCart);
            if (!searchCart) {
                return `Cart with id ${idCart} not found`;
            }
            let index = searchCart.products.findIndex(p => p.id.toString() === idProduct);
            
            if (index > -1) {
                //Existe y se borra
                searchCart.products.splice(index, 1);
                await searchCart.save();
                return 'The product was removed from the cart';
            } else {
                //No existe
                return 'Product not found';
            }
        } catch (error) {
            console.error(error);
            return 'Error removing products from cart';
        }
    }     
}