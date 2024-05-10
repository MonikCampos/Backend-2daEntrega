import mongoose from "mongoose";
const cartsCollection = "carts";

const cartsSchema = new mongoose.Schema({
    products: {
        type: [
            { 
                _id: false,
                id: {type: mongoose.Schema.Types.ObjectId, ref: "products", required: true},
                quantity: {type: Number}
            }
            ],
        },
    },
    {
        timestamps: true,
    });

cartsSchema.set('toJSON', {
    transform: (doc, ret) => {
        delete ret.__v;
        return ret;
    }
});

export const cartsModel = mongoose.model(
    cartsCollection, 
    cartsSchema
);