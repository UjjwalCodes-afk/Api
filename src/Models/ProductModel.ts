import { required } from "joi";
import mongoose, {Schema, Document} from "mongoose";

const prodSchema = new mongoose.Schema({
    prod_name : {type : String, required : true},
    prod_image: {
        type: String,
        required: true,
    },
    prod_price :  {type : Number, required : true},
    prod_des : {type : String, required : true},
    prod_title : {type : String, required : true},
    prod_short_desc : {type : String, required : true},
    prod_category : {type : String,required : true},
},
{timestamps : true, versionKey : false}
)

export const Product = mongoose.model<ProductTable>("products", prodSchema);

export interface ProductTable{
    prod_name : string,
    prod_image : string,
    prod_price : number,
    prod_des : string,
    prod_title : string,
    prod_short_desc : string,
    prod_category : string,
}