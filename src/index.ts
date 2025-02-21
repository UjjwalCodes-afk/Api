import express, {Request,Response} from 'express';

import dotenv from 'dotenv'
import { connectDB } from './config/dbconfig';
import router from './Routes/formRoutes';
import prodRoutes from './Routes/prodRoutes';
import cors from 'cors';
import path from 'path';
import categoryRoutes from './Routes/categoryRoutes';
import cartRoutes from './Routes/CartRoutes';
import session from 'express-session';
import paymentRoute from './Routes/paymentRoutes';
import errHandler from './Middlewares/errorhandler';
import orderRoutes from './Routes/OrderRoutes';
import cloudinary from './Uploads/cloudinary';






const app = express();

//dotenv
dotenv.config();

//middlewares

app.use(express.json());
app.use(errHandler);
app.use(
    session({
        secret: 'your-secret-key', // Replace with a more secure key
        resave: false, // Don't save session if unmodified
        saveUninitialized: true, // Save a session even if it is new (useful for session-based data)
        cookie: {
            secure: false, // Set to true if you're using HTTPS
            httpOnly: true, // Helps prevent cross-site scripting attacks
            maxAge: 24 * 60 * 60 * 1000, // 1 day cookie expiry
        },
    })
);
app.use(cors({
    credentials : true,
    origin : ['http://localhost:5173' , "https://node-react-lake.vercel.app"],
    allowedHeaders : ['Content-Type', 'Authorization', 'stripe-account']
}))




  

const PORT = process.env.PORT || 8000
connectDB();

//routes
app.use('/api/auth', router);
app.use('/api/product', prodRoutes);
app.use('/api/product/add', categoryRoutes)


//cart routes
app.use('/api/product', cartRoutes)

//payment
app.use('/api/payment', paymentRoute)


//orders
app.use('/api/order', orderRoutes)

app.listen(PORT, () => {
    console.log(`Server running on Port ${PORT}`);
})