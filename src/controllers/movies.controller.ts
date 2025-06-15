import { Handler } from 'express'
import bcrypt from 'bcryptjs'
import { db } from '../db/db'
import { generateRefreshToken, generateTokens } from '../crypto/jwt'

/* export const getFavoriteMovies: Handler = async(req, res, next) => {
    try {
        const { id } = req
        const movie = await 
        const user = await findUserById(userId);
        res.status(200).json(user);
    } catch (err) {
        next(err);
    }
} */