import express, {Request, Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';

export const adminMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Extract token from header
  
    console.log('Token extracted from header:', token); // Log the token
  
    if (!token) {
      return res.status(401).json({ message: 'Authentication token is missing' });
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      console.log('Decoded user:', decoded);  // Log decoded token for debugging
      next();
    } catch (err) {
      console.error('Error in token verification:', err); // Log the error details
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
};
  