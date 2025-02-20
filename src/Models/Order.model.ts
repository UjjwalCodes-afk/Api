import mongoose, { Schema, Document } from "mongoose";

// Define the Order Interface
export interface Iorder extends Document {
    userId: mongoose.Types.ObjectId;
    orderId: string;
    products: {
        productId: mongoose.Types.ObjectId;
        quantity: number;
        status: "Pending" | "Shipped" | "Delivered";
    }[];
    status: "Pending" | "Shipped" | "Delivered";
    createdAt: Date;
    updatedAt: Date;
}

// Define the Order Schema
const orderSchema = new Schema<Iorder>(
    {
        userId: { type: Schema.Types.ObjectId, ref: "users", required: true },
        orderId: { type: String, required: true, unique: true },
        products: [
            {
                productId: { type: Schema.Types.ObjectId, ref: "products", required: true },
                quantity: { type: Number, required: true },
                status: { type: String, enum: ["Pending", "Shipped", "Delivered"], required: true, default: "Pending" },
            },
        ],
        status: { type: String, enum: ["Pending", "Shipped", "Delivered"], default: "Pending", required: true },
    },
    { timestamps: true }
);

export const Order = mongoose.model<Iorder>("Orders", orderSchema);
