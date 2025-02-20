import express from 'express'
import { createOrder, deleteOrderByid, getOrderStatus, updateOrderStatus } from '../Controllers/orderController';


const orderRoutes = express.Router();



orderRoutes.post('/create', createOrder);


//check order status

orderRoutes.get('/getStatus', getOrderStatus);


//update order status
orderRoutes.post('/updateStatus', updateOrderStatus);

//delete order if we remove it from cart
orderRoutes.post('/deleteOrder', deleteOrderByid);

export default orderRoutes;