import mongoose, {Document, Schema} from "mongoose";

const categorySchema = new mongoose.Schema({
    category : {type : String, required : true},
}, {
    timestamps : true,
})

export interface categoryModel {
    category : string,
}

export const Category = mongoose.model<categoryModel>("categories", categorySchema);