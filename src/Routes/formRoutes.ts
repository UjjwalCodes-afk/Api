import express from 'express';
import { validateForm } from '../Middlewares/validate.middleware';
import { getAllData, getProductsInfo, getUserInfo, loginData, submitForm } from '../Controllers/formController';
import { getAllProducts } from '../Controllers/productController';
import { userMiddleware } from '../Middlewares/userMiddleware';
import { adminMiddleware } from '../Middlewares/adminMiddleware';


const router = express.Router();

//register a user
router.post('/register', validateForm,submitForm);


//login a user
router.post('/login',loginData );

//logout a user


//get a list of users
router.get('/getAll', getAllData);

//user profile
router.get('/userInfo',getUserInfo);


//get products info
router.get('/getProducts', getProductsInfo)



export default router;