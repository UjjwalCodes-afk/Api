import mongoose, {Document, Schema} from "mongoose";

const cartSchema = new mongoose.Schema({
    userId : {type : mongoose.Schema.Types.ObjectId, ref : 'users', required : false, default : null},
    products : [
        {
            productId : {type : mongoose.Schema.Types.ObjectId, ref : 'products', required : true},
            quantity : {type : Number, default : 1},
        }
    ],

}, {timestamps : true})

export const Cart = mongoose.model<CartDocument>('Cart', cartSchema);

export interface CartDocument extends Document {
    userId : mongoose.Schema.Types.ObjectId | null;
    products : {productId : mongoose.Schema.Types.ObjectId, quantity : Number}[];

}