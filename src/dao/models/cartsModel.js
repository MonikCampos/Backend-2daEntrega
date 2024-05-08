import mongoose from "mongoose";
const cartsCollection = "carts";

const cartsSchema = new mongoose.Schema({
    //id: {type: Number, required: true, unique: true},
    products: {
        type: [
            { 
                _id: false,
                id: {
                    type: mongoose.Schema.Types.ObjectId, 
                    ref: "products",
                    required: true
                },
                quantity: {type: Number, default: 1}
            }
            ],
        default: []  // Array vacío por defecto
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