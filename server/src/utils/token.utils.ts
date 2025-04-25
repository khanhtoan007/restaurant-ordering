import jwt, { Secret } from 'jsonwebtoken';

interface JwtPayload {
  id: string;
}

// Tạo JWT token
export const generateToken = (payload: JwtPayload): string => {
  const secret: Secret = process.env.JWT_SECRET || 'fallback_secret';
  
  return jwt.sign(payload, secret, { expiresIn: '1d' });
};

// Tạo refresh token
export const generateRefreshToken = (payload: JwtPayload): string => {
  const secret: Secret = process.env.JWT_REFRESH_SECRET || 'fallback_refresh_secret';
  return jwt.sign(payload, secret, { expiresIn: '7d' });
};

// Xác thực token
export const verifyToken = (token: string, secretParam?: string): JwtPayload => {
  const secret: Secret = secretParam || process.env.JWT_SECRET || 'fallback_secret';
  return jwt.verify(token, secret) as JwtPayload;
}; 