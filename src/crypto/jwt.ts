import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import { IUser } from '../types/types'

export const generateAccessToken = (user:  IUser) => {
    return jwt.sign({ userId: user.id }, String(process.env.JWT_SECRET), {
        expiresIn: '7d',
    });
}

export const generateRefreshToken = () => {
    const token = crypto.randomBytes(16).toString('base64url');
    return token;
  }
  
export const generateTokens = (user:  IUser) => {
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken();
    return { accessToken, refreshToken };
}