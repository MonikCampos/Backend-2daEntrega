import { cartsModel } from "./models/cartsModel.js";

export default class CartManager {
    
    async getCarts() {
        return await cartsModel.find();
    }

    async getCartById(id) {
        return await cartsModel.findById(id);
    }

    async addCart(cart) {
        return await cartsModel.create(cart);
    }
    async addProductsToCart(idCart, idProduct) {
        try {
            let searchCart = await cartsModel.findById(idCart);
            if (!searchCart) {
                return `Carrito con id ${idCart} no encontrado`;
            }
            let productInCart = searchCart.products.find(p => p.id.toString() === idProduct);
            
            if (productInCart) {
                //Existe y se incrementa la cantidad
                productInCart.quantity++;
            } else {
                //No existe, se agrega un nuevo producto
                searchCart.products.push({ id: idProduct });
            }
            searchCart.save();
            return 'Producto agregado al carrito';
        } catch (error) {
            console.error(error);
        }
    }
    
    async deleteCart(cartId) {
        return await cartsModel.deleteOne({ _id: cartId });
    }
}