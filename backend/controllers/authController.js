import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { createUser, findUserByEmail } from '../utils/dataStore.js';

dotenv.config();

const signToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'Complete all fields.' });

    const existing = await findUserByEmail(email);
    if (existing) return res.status(400).json({ message: 'Email already registered.' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await createUser({ name, email, password: hashed });
    return res.status(201).json({ token: signToken(user._id), user: { name: user.name, email: user.email } });
  } catch (error) {
    return res.status(500).json({ message: 'Registration failed.' });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await findUserByEmail(email);
    if (!user) return res.status(401).json({ message: 'Invalid credentials.' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: 'Invalid credentials.' });

    return res.json({ token: signToken(user._id), user: { name: user.name, email: user.email } });
  } catch (error) {
    return res.status(500).json({ message: 'Login failed.' });
  }
};

export const getProfile = async (req, res) => {
  return res.json({ user: req.user });
};
