import express, {Request,Response} from 'express';
import { Category } from '../Models/categoryModel';

const addCategory = async(req : Request, res : Response) => {
    try {
        const {category} = req.body;
        if(!category){
            res.status(400).json({
                message : 'Please provide category'
            })
        }
        const saveCategory = new Category({category});
        await saveCategory.save();
        res.status(200).json({
            success : true,
            message : 'Category saved successfully'
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message : 'Error in api'
        })
    }
}
const fetchCategory = async(req : Request, res : Response) => {
    try {
        const name = await Category.find();
        if (name.length > 0) {
            res.status(200).json({ message: 'Categories found', category: name });
          } else {
            res.status(404).json({ message: 'No categories found' });
          }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message : 'Error in the api'
        })
    }
}
export {addCategory, fetchCategory}