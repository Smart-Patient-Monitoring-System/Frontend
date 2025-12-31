import jwt from 'jsonwebtoken';

export const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET || 'fallback-secret-key',
    {
      expiresIn: process.env.JWT_EXPIRE || '7d',
    }
  );
};

