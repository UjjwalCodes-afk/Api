import express, { Request, Response } from "express";
import { Form, FormModel } from "../Models/formModel";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Product } from "../Models/ProductModel";

export const submitForm = async (req: Request, res: Response) => {
    try {

        const { firstName, lastName, phoneNumber, email, password, confirmPassword, role }: FormModel = req.body;

        if (!firstName || !lastName || !phoneNumber || !email || !password || !confirmPassword || !role) {
            res.status(400).send({
                success: false,
                message: 'Please fill all the required details.'
            });
        }
        const checkExistingUser = await Form.findOne({email : email});
        if(checkExistingUser){
            res.status(400).send({
                success : false,
                message : 'User already exists'
            });
        }

        if (password !== confirmPassword) {
            res.status(400).send({
                success: false,
                message: 'Passwords do not match.'
            });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new user instance
        const newUser = new Form({
            firstName,
            lastName,
            phoneNumber,
            email,
            password: hashedPassword,
            confirmPassword,
            role
        });

        // Save the user to the database
        await newUser.save();

        // Send successful response
        res.status(201).send({
            success: true,
            message: 'User registered successfully.'
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'An error occurred while processing your request.'
        });
    }
};


export const loginData = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await Form.findOne({ email });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found"
            });
        }

        // Compare password
        const comparePass = await bcrypt.compare(password, user.password);
        if (!comparePass) {
            return res.status(400).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET as string,
            { expiresIn: "1d" }
        );

        res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            userId : user._id
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

export const getAllData = async (req: Request, res: Response) => {
    try {
        const findAll = await Form.find({});
        res.status(201).send({
            success : true,
            messge : 'Users found',
            findAll
        })
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Error in api'
        })
        console.log(error);
    }
}



interface DecodedToken {
    id: string;  // Assuming `userId` is in the decoded token
    role : string;
}

export const getUserInfo = async (req: Request, res: Response) => {
    try {
        // Extract token from Authorization header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(400).json({ message: 'No token provided' });
        }

        const token = authHeader.split(' ')[1];

        // Verify and decode the token
        let decoded: DecodedToken;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET as string) as DecodedToken;
        } catch (err) {
            return res.status(401).json({ message: 'Invalid or expired token' });
        }

        // Fetch user from the database using the decoded userId
        const user = await Form.findById(decoded.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Send user data in response
        return res.status(200).json({
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            phoneNumber: user.phoneNumber,
        });
    } catch (error) {
        console.error('Error fetching user info:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const getProductsInfo = async (req : Request, res : Response) => {
    try {
        const products = await Product.find();

        const productInfo = products.map(product => {
            const productObj = product.toObject(); // Convert to plain object
            return {
                ...productObj,
                prod_image: `http://localhost:8080/${product.prod_image.replace(/\\/g, '/')}`
            };
        });

        res.json({ message: 'Data fetched successfully', productInfo });
    } catch (error) {
        res.status(500).json({
            message : 'Error in api'
        })
        console.log(error);
    }
}



        // if (user.role !== "user") {
        //     return res.status(403).json({
        //         success: false,
        //         message: "Access denied. Only admins can log in."
        //     });
        // }