import express from 'express';
import { addCategory, fetchCategory } from '../Controllers/categoryController';


const categoryRoutes = express.Router();


categoryRoutes.post('/addCategory',addCategory );
categoryRoutes.get('/getCategory', fetchCategory);

export default categoryRoutes;