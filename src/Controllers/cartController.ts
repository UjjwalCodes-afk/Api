import express, { Request, Response } from 'express';
import { Product } from '../Models/ProductModel';
import { Cart } from '../Models/Cart';
import mongoose from 'mongoose';



const addToCart = async (req: Request, res: Response) => {
    const { userId, productId, action } = req.body;
    try {
        // Check if product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(401).json({
                message: 'Product not found'
            });
        }

        // Find the user cart
        let cart;
        if (userId) {
            cart = await Cart.findOne({ userId });
        } else {
            if (!req.session.cartId) {
                req.session.cartId = [];
            }
            cart = await Cart.findOne({ userId: null });
        }

        // If cart doesn't exist, create a new one
        if (!cart) {
            if (action === "decrement") {
                return res.status(400).json({
                    message: 'Cannot decrement, cart is empty'
                });
            }
            cart = new Cart({
                userId: userId || null, // Set userId as null for guest users
            });
            await cart.save();
            return res.status(200).json(cart); // Return response here
        }

        // Check if product already exists in cart
        const existingProd = cart.products.find((item) => item.productId.toString() === productId);
        if (existingProd) {
            if (action === "increment") {
                existingProd.quantity = Number(existingProd.quantity) + 1;
            } else if (action === "decrement") {
                existingProd.quantity = Number(existingProd.quantity) - 1;
            } else {
                cart.products = cart.products.filter((item) => item.productId.toString() !== productId);
            }
        } else {
            if (action === "increment") {
                cart.products.push({ productId, quantity: 1 });
            } else {
                return res.status(400).json({
                    message: 'Cannot decrement, product is not in cart'
                });
            }
        }

        await cart.save();
        return res.status(200).json(cart); // Send response only once
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Error in API'
        });
    }
};

const getProductByUserId = async (req: Request, res: Response) => {
    const { userId } = req.params;
    try {
        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        // Fetch fresh cart data
        const cart = await Cart.findOne({ userId }).lean();
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        // Fetch product details for all items in the cart
        const productDetailsPromises = cart.products.map(async (item) => {
            const product = await Product.findById(item.productId).lean();
            return {
                productId: item.productId,
                quantity: item.quantity,
                prod_name: product?.prod_name || "Unknown",
                prod_image: product?.prod_image
                    ? `http://localhost:8080/${product.prod_image.replace(/\\/g, '/')}`
                    : "",
                prod_price: product?.prod_price || 0,
                prod_des: product?.prod_des || "",
                prod_title: product?.prod_title || "",
                prod_short_desc: product?.prod_short_desc || "",
                prod_category: product?.prod_category || "",
            };
        });

        const productDetails = await Promise.all(productDetailsPromises);

        return res.status(200).json({
            cart: {
                userId: cart.userId,
                products: productDetails
            }
        });
    } catch (error) {
        console.error("Error fetching cart:", error);
        return res.status(500).json({ message: "Error in API" });
    }
};


const deleteItems = async(req : Request, res : Response) => {
    const{userId, productId} = req.body;
    try {
        if(!productId){
            return res.status(400).json({
                message : 'product id is required'
            })
        }
        //logged in users
        if(userId){
            const cart = await Cart.findOne({userId});
            if(!cart){
                return res.status(400).json({
                    message : 'Cart not found'
                })
            }
            cart.products = cart.products.filter(item => item.productId.toString()!==productId);
            await cart.save();
            return res.status(200).json({message : 'Item removed successfully'});
        }
        if (!req.session.cartId || !Array.isArray(req.session.cartId)) {
            return res.status(404).json({
                message: 'Guest cart is empty',
            });
        }
        req.session.cartId = req.session.cartId.filter(
            (item: { productId: string }) => item.productId !== productId
        );
        req.session.save((err) => {
            if (err) {
                return res.status(500).json({
                    message: 'Error saving session',
                });
            }
            return res.status(200).json({ message: 'Item removed from guest cart' });
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message : 'Error in api'
        })
    }
}

const updateCart = async(req : Request, res : Response) => {
    const{userId, productId, quantity}  = req.body;
    try {
        const cart = await Cart.findOne({userId});
        if(cart){
            const existingProductIndex = cart.products.findIndex(item => item.productId.toString() === productId);
            if(existingProductIndex >=0){
                cart.products[existingProductIndex].quantity = quantity;
            }
            else{
                cart.products.push({productId, quantity});
            }
            await cart.save();
            return res.status(200).json({message : 'Cart updated successfully'});
        }
        else{
            return res.status(400).json({message : 'User must be logged in'});
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({message : 'Error in api'});
    }
}

const removeItemFromCart = async(req : Request, res : Response) => {
    const {userId, productId} = req.body;
    try {
        if(userId){
            const cart = await Cart.findOne({userId});
            if(cart){
                cart.products = cart.products.filter(item => item.productId.toString() !== productId);
                await cart.save();
                return res.status(200).json({message : 'Item removed from cart'});
            }
            else{
                return res.status(400).json({message : 'Cart not found'});
            }
        }
        else{
            return res.status(500).json({message : 'item removed from guest cart'});
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({message : 'Error in api'})
    }
}


const getCartCount = async(req : Request, res : Response) => {
    try {
        const userId = req.params.userId
        if(!userId){
            return res.status(400).json({
                message : 'please provide userId'
            })
        }
        const findUserId = await Cart.findOne({userId});
        if(!findUserId){
            return res.status(400).json({
                cart : 0
            })
        }
        const totalCount = findUserId.products.reduce((total,item) => total + Number( item.quantity), 0);
        return res.status(200).json({
            message  :'total count is : ',
            totalCount
        })

    } catch (error) {
        res.status(500).json({
            message : 'error in api'
        })
        console.log(error);
    }
}

const clearCart = async(req : Request, res : Response) => {
    const{userId} = req.body; 
    try {
        if(!userId){
            return res.status(404).json({
                message : 'User not found'
            })
        }
        const cart = await Cart.findOne({userId});
        if(!cart){
            return res.status(400).json({
                message : 'Cart not found'
            })
        }
        const updatedCart = await Cart.findOneAndUpdate(
            { userId },
            { $set: { products: [] } },
            { new: true, runValidators: true } // Ensures the updated cart is returned
          );
        return res.status(200).json({
            message : 'cart has been cleared successfully',
            updatedCart
        })
    } catch (error) {
        console.log(error);
    }
}

export { addToCart, getProductByUserId, deleteItems, updateCart, getCartCount, clearCart}