import Stripe from 'stripe';
import { stripeConfig } from '../stripeConfig';
console.log(process.env.STRIPE_SECRET_KEY);
const stripe = new Stripe(stripeConfig.secretKey, {
    apiVersion : '2025-01-27.acacia',
})

export const createPayment = async(amount : number) => {
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency : 'usd'
        })
        return paymentIntent
    } catch (error) {
        throw new Error("Payment intent creation failed");
    }
}