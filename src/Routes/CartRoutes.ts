import express, {Request, Response} from 'express';
import { addToCart, clearCart, deleteItems, getCartCount, getProductByUserId, updateCart } from '../Controllers/cartController';


const cartRoutes = express.Router();


cartRoutes.post('/add-to-cart', addToCart);

cartRoutes.get('/getProductById/:userId', getProductByUserId);

cartRoutes.post('/delete', deleteItems);

//update cart
cartRoutes.put('/update', updateCart);

//get cart count
cartRoutes.get('/count/:userId', getCartCount);

//clear cart after payment
cartRoutes.post('/deleteCart', clearCart);

export default cartRoutes;