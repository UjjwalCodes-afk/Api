import express, { Request, Response } from 'express';
import { Product } from '../Models/ProductModel';
import jwt from 'jsonwebtoken';
import path from 'path';
import fs from 'fs-extra';
import axios from 'axios';
import upload from '../multer/upload';
import { Form } from '../Models/formModel';
import cloudinary from 'cloudinary';

interface DecodedToken {
    userId: string;  // Assuming 'userId' is in the JWT payload
  }

// import { Request, Response } from 'express';
// import axios from 'axios';
// import path from 'path';
// import fs from 'fs-extra'; // For ensuring directories exist and writing files
// import upload from './utils/multer'; // Import the Multer setup
// import { Product } from './models/Product'; // Assuming your Product model is here

const uploadProduct = async (req: Request, res: Response) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Please upload the product image' });
        }

        const { prod_name, prod_price, prod_des, prod_title, prod_short_desc, prod_category } = req.body;
        const prod_image = req.file.path;


        if (!prod_name || !prod_price || !prod_des || !prod_title || !prod_short_desc || !prod_image || !prod_category) {
            return res.status(400).send({
                success: false,
                message: 'Please provide all required product details'
            });
        }
        const cloudinaryResult = await cloudinary.v2.uploader.upload(req.file.path, {
            folder : 'products'
        })
        if(!cloudinaryResult.secure_url){
            return res.status(500).json({
                message : "image upload failed"
            })
        }

        // Check if the product already exists
        const existingProd = await Product.findOne({ prod_name });
        if (existingProd) {
            return res.status(400).send({
                success: false,
                message: 'Product already exists'
            });
        }



        // Save the product in the database with the image path
        const newProd = new Product({
            prod_name,
            prod_image : cloudinaryResult.secure_url, // Store the image path in the DB
            prod_price,
            prod_des,
            prod_title,
            prod_short_desc,
            prod_category
        });

        await newProd.save();

        return res.status(200).send({
            success: true,
            message: 'Product saved successfully'
        });
    } catch (error) {
        console.log(error.message);
        console.log(error.code);
        return res.status(500).send({
            success: false,
            message: 'Error processing the API request'
        });
    }
};


const getAllProducts = async (req: Request, res: Response) => {
    try {
        const prodFind = await Product.find({});
        res.status(200).send({
            success: true,
            message: 'List of products',
            prodFind
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in fetching list'
        });
    }
};

const fetchCategoriesController = async (req: Request, res: Response) => {
    try {
        const categories = await Product.distinct('prod_category');
        if (categories.length == 0) {
            res.status(400).send({
                success: false,
                message: 'No categories found'
            })
        }
        res.status(200).send({
            success: true,
            message: 'Categories found',
            categories,
        })
    } catch (error) {
        res.status(500).json({
            message: 'Error in the api'
        })
    }
}

const deleteProductById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!id) {
            res.status(400).json({
                message: 'Id is required'
            })
        }
        const deleteProd = await Product.findByIdAndDelete(id);
        if (!deleteProd) {
            res.status(401).json({
                message: 'Prod not found'
            })
        }
        res.status(200).json({
            message: 'Product deleted successfully',
            deleteProd
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Error in delete prod api'
        })
    }
}

const editProductById = async (req: Request, res: Response) => {
    try { 
        const { prod_name, prod_price, prod_des, prod_title, prod_short_desc } = req.body;
        const updateProd = await Product.findByIdAndUpdate(req.params.id, { prod_name, prod_price, prod_des, prod_title, prod_short_desc}, {new : true, runValidators : true});
        if(!updateProd){
             res.status(400).json({
                message : 'Product not found'
            })
        }
        res.status(200).json({
            message : 'Product updated successfully',
            updateProd
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Error in delete prod api'
        })
    }
}




export { uploadProduct, getAllProducts, fetchCategoriesController, deleteProductById, editProductById };
