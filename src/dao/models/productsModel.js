import mongoose from "mongoose"
import mongoosePaginate from 'mongoose-paginate-v2';

const productsCollection="products"
const productsSchema=new mongoose.Schema(
    {    
        id: {type:Number, required: true, unique: true},
        title: {type:String, required: true},
        description: {type: String, required: true}, 
        code: {type:String, required: true, unique: true},
        price: {type:Number, required: true},
        status: {type:Boolean, default: true},
        stock: {type:Number, required: true},
        category: {type:String, required: true},
        brand: {type:String, required: true},
        thumbnail: {type:Array, required: false}
    },
    {
        timestamps: true,
    }
);
productsSchema.set('toJSON', {
    transform: (doc, ret) => {
        delete ret.__v;
        return ret;
    }
});

productsSchema.plugin(mongoosePaginate);
export const productsModel=mongoose.model(
    productsCollection,
    productsSchema
);