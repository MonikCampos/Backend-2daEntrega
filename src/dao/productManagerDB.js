import { productsModel } from "./models/productsModel.js ";

export default class ProductManager {
    
    async getAllPaginate(page=1){
        return await productsModel.paginate({}, {limit:10, page, lean:true})
    }

    async getProducts(limit,skip) {
        //devuelve los productos de la bd
        //console.log(`Limit: ${limit}, Page: ${page}, Sort: ${sort}, Filters: ${JSON.stringify(filters)}`)
        //let query = productsModel.find(filters).lean().limit(limit).skip((page - 1) * limit).sort(sort);
        let query = productsModel.find().lean().limit(limit).skip(skip);
        return await Promise.all([
            query,
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