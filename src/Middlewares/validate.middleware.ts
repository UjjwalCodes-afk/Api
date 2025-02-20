import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';


export const formSchema = Joi.object({
    firstName: Joi.string().min(2).max(50).required(),
    lastName: Joi.string().min(2).max(50).required(),
    phoneNumber: Joi.string().pattern(/^\d{10}$/).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages({
        'any.only': 'Passwords must match',
    }),
    role : Joi.string().valid('admin', 'user').default('user').required().messages({
        'any.only' : 'Role must be admin or user'
    })
});


export const validateForm = (req: Request, res: Response, next: NextFunction) => {
    const { error } = formSchema.validate(req.body);

    if (error) {
         res.status(400).json({
            success: false,
            message: error.details[0].message,
        });
    }


    next();
};
