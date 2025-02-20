import { Request, Response, NextFunction } from "express";

const errHandler = (err : any, req : Request, res : Response, next : NextFunction) => {
    console.log(err.stack);
    res.status(500).json({
        message : 'Something went wrong'
    })
}

export default errHandler;