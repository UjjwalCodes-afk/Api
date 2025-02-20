import express from 'express';
import { deleteProductById, editProductById, fetchCategoriesController, getAllProducts, uploadProduct } from '../Controllers/productController';
import { adminMiddleware } from '../Middlewares/adminMiddleware';
import upload from '../multer/upload';

const prodRoutes = express.Router();

//role based
prodRoutes.post('/Post',adminMiddleware ,upload.single('prod_image') ,uploadProduct);

prodRoutes.get('/products',getAllProducts);

//fetch categories
prodRoutes.get('/categories', fetchCategoriesController )

//delete prod
prodRoutes.delete('/delete/:id', deleteProductById)


//edit product
prodRoutes.put('/update/:id', editProductById);

export default prodRoutes;