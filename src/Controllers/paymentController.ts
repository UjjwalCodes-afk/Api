import { Request, Response } from "express";
import { createPayment as createPaymentService } from "../Services/stripeService";
import Stripe from "stripe";


const stripe = new Stripe('sk_test_51MJri9L8uTzULmwrZKNMJTCO6aDR7eHt9fjBVDCXBi0xhNWx32ANNJiJOBaWgVNTH1lYdMh7MpUotbdQYZGWmicg00MOnwGA9G', { apiVersion: '2025-01-27.acacia' })

const endPoint = process.env.STRIPE_WEBHOOK_SECRET as string;

export const createPayment = async (req: Request, res: Response) => {
    try {
        const { amount, payment_method } = req.body;

        // Ensure the amount is valid
        if (!amount || typeof amount !== 'number') {
            return res.status(400).json({
                message: 'Amount is required and should be a number.',
            });
        }

        // Ensure the payment method ID is provided
        if (!payment_method || typeof payment_method !== 'string') {
            return res.status(400).json({
                message: 'Payment method ID is required.',
            });
        }

        // Define the connected account
        const connectedAccount = 'acct_1Mh1k3Q8VttiddZc';  // The connected account ID

        // Create a PaymentIntent with manual confirmation
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount * 100, // Convert to cents
            currency: 'usd',
            payment_method: payment_method,
            confirmation_method: 'manual',
            confirm: true,  // Provide a return URL for redirect payments
            return_url : 'http://localhost:5173/success'
        }, {
            stripeAccount: connectedAccount,  // The connected account ID
        });

        // Respond with the client secret to complete the payment
        res.status(200).json({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({
            message: 'Error processing payment.',
        });
    }
};

export const verifyPaymentCustom = async (req: Request, res: Response) => {
    try {
        const { clientSecret } = req.body;

        if (!clientSecret || typeof clientSecret !== "string" || !clientSecret.includes("_secret")) {
            return res.status(400).json({ message: "Valid client secret is required." });
        }

        // Extract paymentIntentId
        const paymentIntentId = clientSecret.split("_secret")[0];
        console.log("Extracted PaymentIntent ID:", paymentIntentId);

        // Retrieve payment intent from Stripe
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId, {
            stripeAccount: 'acct_1Mh1k3Q8VttiddZc' // If using Connect accounts
        });
        console.log(paymentIntent);

        if (paymentIntent.status === "succeeded") {
            return res.status(200).json({ message: "Payment verified successfully", paymentIntent });
        } else {
            return res.status(400).json({ message: "Payment not completed", status: paymentIntent.status, paymentIntent });
        }
    } catch (error) {
        console.error("Error verifying payment:", error);
        return res.status(500).json({ message: "Error verifying payment", error: error.message });
    }
};




export const createSession = async (req: Request, res: Response) => {
    try {
        const amount = Number(req.body.amount);

        if (isNaN(amount) || amount <= 0) {
            return res.status(400).json({
                message: 'Amount must be a valid number greater than zero'
            });
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: 'Sample product',
                        },
                        unit_amount: amount * 100,  // Convert dollars to cents
                    },
                    quantity: 1,
                }
            ],
            mode: 'payment',
            success_url: `http://localhost:5173/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `http://localhost:5173/cancel?session_id={CHECKOUT_SESSION_ID}`, // Corrected the cancel_url
        });
        console.log(session.id);

        return res.status(200).json({ sessionId: session.id });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error in API' });
    }
};

export const verifyPayment = async (req: Request, res: Response) => {
    const { sessionId } = req.body;

    try {
        // Retrieve the session from Stripe
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        console.log(session);
        if (session.payment_status === 'paid') {
            return res.status(200).json({ status: 'success' });
        } else if (session.payment_status === 'unpaid') {
            return res.status(400).json({ status: 'failed', message: 'Payment was unsuccessful or not completed.' });
        }
        else {
            return res.status(400).json({ status: 'failed', message: 'Unknown payment status.' });
        }
    } catch (error) {
        console.error('Error verifying payment:', error.code);
        return res.status(500).json({ status: 'error', message: error.message });
    }
};




