import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { findUserByIdWithoutPassword } from '../utils/dataStore.js';

dotenv.config();

export const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await findUserByIdWithoutPassword(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized access' });
  }
};
