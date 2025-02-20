// custom.d.ts (or extend in an existing type definitions file)
import { Document } from 'mongoose';
import { FormModel } from './Models/formModel';  

declare global {
    namespace Express {
        interface Request {
            user?: { id: string; role: string }; 
        }
    }
}
