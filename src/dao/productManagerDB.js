import { query } from "express";
import { productsModel } from "./models/productsModel.js ";

export default class ProductManager {
    
    async getProducts(limit,page,sort) {
        //devuelve los productos de la bd
        //return await productsModel.find();
        return await Promise.all([
                productsModel.find().lean().limit(limit).skip((page - 1) * limit).sort(sort),
                productsModel.countDocuments()
        ]);
    }

    async getProductById(id) {
        return await productsModel.findById(id);
    }   

    async getProductsBy(filtro) {
        // El filtro puede ser cualquier campo = {email:"test@test.com", edad:40}
        return await productsModel.findOne(filtro);
    }

    async addProduct(product) {
        return await productsModel.create(product);
    }
    
    async updateProducts(id, productData) {
        return await productsModel.findByIdAndUpdate(id, productData, {
            runValidators: true,
            returnDocument: "after",
        });
    }

    async deleteProducts(productId) {
        return await productsModel.deleteOne({ _id: productId });
    }
}