import express, {Request, Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';

export const userMiddleware = async(req : Request, res : Response, next : NextFunction) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if(!token){
            res.status(400).send({
                success : false,
                message : 'Invalid token'
            })
        }
        const decoded = jwt.verify(token as string, process.env.JWT_SECRET as string)as {id :string, role : string}
        if(decoded.role !=='user'){
             res.status(200).send({
                success : true,
                message : 'Access granted'
            })
        }
        req.user = decoded;
        next();
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success : false,
            message : 'Error in api'
        })
    }
}