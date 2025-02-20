import express from 'express';
import { createPayment, createSession, verifyPayment, verifyPaymentCustom,  } from '../Controllers/paymentController';


const paymentRoute = express.Router();

paymentRoute.post('/create-payment', createPayment)

paymentRoute.post('/create-session', createSession);

paymentRoute.post('/verify-payment',verifyPayment )

paymentRoute.post('/verify-Custom', verifyPaymentCustom)

export default paymentRoute;