import crypto from 'crypto';
import User from '../models/User.js';
import InterviewSession from '../models/InterviewSession.js';

const memoryUsers = [];
const memorySessions = [];

const isMongoMode = () => process.env.DB_MODE === 'mongo';
const makeId = () => crypto.randomBytes(12).toString('hex');

const sanitizeUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
});

export const findUserByEmail = async (email) => {
  if (isMongoMode()) return User.findOne({ email });
  return memoryUsers.find((item) => item.email === email) || null;
};

export const createUser = async ({ name, email, password }) => {
  if (isMongoMode()) return User.create({ name, email, password });
  const user = { _id: makeId(), name, email, password, createdAt: new Date() };
  memoryUsers.push(user);
  return user;
};

export const findUserByIdWithoutPassword = async (id) => {
  if (isMongoMode()) return User.findById(id).select('-password');
  const user = memoryUsers.find((item) => item._id.toString() === id.toString());
  return user ? sanitizeUser(user) : null;
};

export const createSession = async (payload) => {
  if (isMongoMode()) return InterviewSession.create(payload);
  const session = { _id: makeId(), ...payload, createdAt: new Date() };
  memorySessions.push(session);
  return session;
};

export const findSessionByIdForUser = async (id, userId) => {
  if (isMongoMode()) return InterviewSession.findOne({ _id: id, user: userId });
  return memorySessions.find((item) => item._id.toString() === id.toString() && item.user.toString() === userId.toString()) || null;
};

export const saveSession = async (session) => {
  if (isMongoMode()) return session.save();
  const index = memorySessions.findIndex((item) => item._id.toString() === session._id.toString());
  if (index >= 0) memorySessions[index] = session;
  return session;
};

export const listSessionsByUser = async (userId) => {
  if (isMongoMode()) return InterviewSession.find({ user: userId }).sort({ createdAt: -1 });
  return memorySessions
    .filter((item) => item.user.toString() === userId.toString())
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};
