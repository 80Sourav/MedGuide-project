import jwt from 'jsonwebtoken';

const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET || 'mediguide_super_secret_jwt_key_2026',
    { expiresIn: '30d' }
  );
};

export default generateToken;
