import { Request, Response } from "express";
import { Order } from "../Models/Order.model";
import { Product } from "../Models/ProductModel";
import mongoose from "mongoose";


const generateOrderId = (): string => {
    const timeStamp = Date.now();
    return `Ord-${timeStamp}`
}


export const createOrder = async (req: Request, res: Response) => {
    const { userId, products, status }: { userId: string, products: { productId: string, quantity: number, status?: string }[], status?: string } = req.body;

    try {
        // Validate required fields
        if (!userId || !Array.isArray(products) || products.length === 0) {
            return res.status(400).json({ message: "userId and products are required, and products must be a non-empty array" });
        }

        // Convert userId to ObjectId
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Invalid userId" });
        }

        // Validate each product
        for (const item of products) {
            if (!mongoose.Types.ObjectId.isValid(item.productId)) {
                return res.status(400).json({ message: `Invalid productId: ${item.productId}` });
            }
            const product = await Product.findById(item.productId);
            if (!product) {
                return res.status(404).json({ message: `Product with id ${item.productId} not found` });
            }
            item.status = item.status || "Pending"; // Ensure product status
        }

        // Check if user already has an order
        let existingOrder = await Order.findOne({ userId });

        if (existingOrder) {
            products.forEach((newProduct) => {
                const existingProductIndex = existingOrder.products.findIndex(
                    (p) => p.productId.toString() === newProduct.productId
                );

                if (existingProductIndex !== -1) {
                    // Update quantity if product exists
                    existingOrder.products[existingProductIndex].quantity += newProduct.quantity;
                    existingOrder.products[existingProductIndex].status = existingOrder.products[existingProductIndex].status || "Pending";
                } else {
                    // Add new product
                    newProduct.status = newProduct.status || "Pending";
                    existingOrder.products.push(newProduct);
                }
            });

            existingOrder.updatedAt = new Date();
            await existingOrder.save();

            return res.status(200).json({ message: "Order updated successfully", order: existingOrder });
        }

        // Create new order
        const orderId = generateOrderId();
        const newOrder = new Order({
            userId,
            orderId,
            products: products.map((product) => ({
                productId: product.productId,
                quantity: product.quantity,
                status: product.status || "Pending",
            })),
            status: status || "Pending",
        });

        await newOrder.save();
        return res.status(201).json({ message: "Order created successfully", order: newOrder });

    } catch (error: any) {
        console.error("Order creation error:", error.message);
        return res.status(500).json({ message: "Error occurred while creating the order" });
    }
};



export const getOrderStatus = async (req: Request, res: Response) => {
    const { orderId } = req.body;
    try {
        if (!orderId) {
            return res.status(404).json({
                message: 'Please provide order id'
            })
        }
        const order = await Order.findOne({ orderId });
        if (!order) {
            return res.status(401).json({
                message: 'Order not found'
            })
        }
        res.status(200).json({
            orderId: order.orderId,
            products: order.products,
            status: order.status,
            createdAt: order.createdAt,
            updatedAt: order.updatedAt,
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Error in api' })
    }
}

export const updateOrderStatus = async (req: Request, res: Response) => {
    try {
        const { orderId, status } = req.body;

        // Validate input fields
        if (!orderId || !status) {
            return res.status(400).json({
                message: 'Order id and status are required'
            });
        }

        // Validate status value
        const validStatus = ['Pending', 'Shipped', 'Delivered'];
        if (!validStatus.includes(status)) {
            return res.status(400).json({
                message: 'Invalid status'
            });
        }

        // Find the order using orderId
        const order = await Order.findOne({ orderId });  // Use findOne to search by orderId field
        if (!order) {
            return res.status(400).json({
                message: 'Order not found'
            });
        }

        // Update the status of each product within the order
        const updatedProducts = order.products.map((product) => {
            // Update the status only for products that are "Pending"
            if (product.status === 'Pending') {
                return {
                    ...product,
                    status: status,  // Set the status to the provided one
                };
            }
            return product;  // Leave other products unchanged
        });

        // Update the order with the new status for both products and the order itself
        const updatedOrder = await Order.findOneAndUpdate(
            { orderId },  // Use orderId for searching
            {
                $set: {
                    products: updatedProducts,  // Set updated products with new status
                    status: status,              // Set new status for the order itself
                }
            },
            { new: true }  // Return the updated order
        );

        if (!updatedOrder) {
            return res.status(404).json({
                message: 'Order update failed'
            });
        }

        // Return the updated order details
        return res.status(200).json({
            message: 'Order updated successfully',
            order: {
                orderId: updatedOrder.orderId,
                userId: updatedOrder.userId,
                products: updatedOrder.products.map((product) => ({
                    productId: product.productId,
                    quantity: product.quantity,
                    status: product.status
                })),
                status: updatedOrder.status,
                updatedAt: updatedOrder.updatedAt
            }
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Error in updating the order'
        });
    }
};


export const deleteOrderByid = async (req: Request, res: Response) => {
    const { userId, productId } = req.body;
    try {
        if (!userId || !productId) {
            return res.status(400).json({
                message: 'product id and userID and required'
            })
        }
        const order = await Order.findOne({ userId });
        if (!order) {
            return res.status(404).json({
                message: 'Order not found'
            })
        }
        //remove products
        order.products = order.products.filter((product) => product.productId.toString() !== productId.toString());
        if (order.products.length === 0) {
            order.products = [];
        }
        await order.save();
        return res.status(200).json({
            message: order.products.length === 0 ? "Order is empty" : "producted removed",
            order
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Error in api'
        })
    }
}