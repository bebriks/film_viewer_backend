import { Handler } from 'express'
import bcrypt from 'bcryptjs'
import { db } from '../db/db'
import { findUserByEmail, findUserById } from '../utils/user.service'
import { generateTokens } from '../crypto/jwt'
import { addRefreshTokenToWhitelist, deleteRefreshToken } from '../utils/auth.service'
import { AuthenticatedRequest } from '../types/express'

// Все обработчики должны возвращать void или Promise<void>
export const getUsers: Handler = async (req, res) => {
    try {
        const allUsers = await db.user.findMany()
        res.status(200).json(allUsers)
    } catch (error) {
        res.status(500).json({ error: "Internal server error" })
    }
}

export const getProfile: Handler = async (req: AuthenticatedRequest, res) => {
    try {
        const userId = req.user?.userId;
        console.log(userId)
        if (!userId) {
            res.status(401).json({ error: "Unauthorized" })
            return
        }

        const user = await findUserById(userId)
        if (!user) {
            res.status(404).json({ error: "User not found" })
            return
        }

        res.status(200).json({
            id: user.id,
            name: user.name,
            email: user.email,
            createdAt: user.createdAt
        })
    } catch (error) {
        res.status(500).json({ error: "Internal server error" })
    }
}

export const getFavorites: Handler = async (req: AuthenticatedRequest, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            res.status(401).json({ error: "Unauthorized" })
            return
        }

        const favorites = await db.favorite.findMany({
            where: { userId }
        })

        res.status(200).json(favorites)
    } catch (error) {
        res.status(500).json({ error: "Internal server error" })
    }
}

export const login: Handler = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ error: "Email and password are required" })
        }

        const existingUser = await findUserByEmail(email)
        if(!existingUser) {
            return
        }
        if (!existingUser) {
            res.status(401).json({ error: "Invalid credentials" })
        }

        const validPassword = await bcrypt.compare(password, existingUser.password)
        if (!validPassword) {
            res.status(401).json({ error: "Invalid credentials" })
        }

        const { accessToken, refreshToken } = generateTokens(existingUser)
        await addRefreshTokenToWhitelist({ refreshToken, userId: existingUser.id })

        res.status(200).json({
            accessToken,
            refreshToken,
            user: {
                id: existingUser.id,
                name: existingUser.name,
                email: existingUser.email
            }
        })
    } catch (error) {
        res.status(500).json({ error: "Internal server error" })
    }
}

export const register: Handler = async (req, res) => {
    try {
        const { name, email, password } = req.body
        if (!email || !password || !name) {
            res.status(400).json({ error: "Name, email and password are required" })
            return
        }

        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(password, salt)

        const existedUser = await findUserByEmail(email)
        if (existedUser) {
            res.status(409).json({ error: "Email already in use" })
            return
        }

        const user = await db.user.create({
            data: { email, password: hashPassword, name }
        })

        const { accessToken, refreshToken } = generateTokens(user)
        await addRefreshTokenToWhitelist({ refreshToken, userId: user.id })

        res.status(201).json({
            accessToken,
            refreshToken,
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        })
    } catch (error) {
        res.status(500).json({ error: "Internal server error" })
    }
}

export const logout: Handler = async (req, res) => {
    try {
        const { refreshToken } = req.body
        if (!refreshToken) {
            res.status(400).json({ error: "Refresh token required" })
            return
        }

        await deleteRefreshToken(refreshToken)
        res.status(200).json({ message: "Logged out successfully" })
    } catch (error) {
        res.status(500).json({ error: "Internal server error" })
    }
}

export const addToFavorites: Handler = async (req, res) => {
    try {
        const { userId, movieId } = req.body

        if (!userId) {
            res.status(401).json({ error: "Unauthorized" })
            return
        }
        if (!movieId) {
            res.status(400).json({ error: "Movie ID is required" })
            return
        }

        const existingFavorite = await db.favorite.findFirst({
            where: { 
                userId, 
                movieId
            }
        })

        if (existingFavorite) {
            res.status(409).json({ error: "Movie already in favorites" })
            return
        }

        const favorite = await db.favorite.create({
            data: { userId, movieId }
        })

        res.status(201).json(favorite)
    } catch (error) {
        res.status(500).json({ error: "Internal server error" })
    }
}

export const removeFromFavorites: Handler = async (req: AuthenticatedRequest, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            res.status(401).json({ error: "Unauthorized" })
            return
        }

        const { favoriteId } = req.params
        if (!favoriteId) {
            res.status(400).json({ error: "Favorite ID is required" })
            return
        }

        const favorite = await db.favorite.findUnique({
            where: { id: favoriteId }
        })

        if (!favorite) {
            res.status(404).json({ error: "Favorite not found" })
            return
        }

        if (favorite.userId !== userId) {
            res.status(403).json({ error: "Forbidden" })
            return
        }

        await db.favorite.delete({
            where: { id: favoriteId }
        })

        res.status(200).json({ message: "Removed from favorites" })
    } catch (error) {
        res.status(500).json({ error: "Internal server error" })
    }
}

export const createComment: Handler = async (req: AuthenticatedRequest, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            res.status(401).json({ error: "Unauthorized" })
            return
        }

        const { movieId, text, parentId } = req.body
        if (!movieId || !text) {
            res.status(400).json({ error: "Movie ID and text are required" })
            return
        }

        const comment = await db.comment.create({
            data: {
                text,
                userId,
                movieId,
                parentId: parentId || null
            }
        })

        res.status(201).json(comment)
    } catch (error) {
        res.status(500).json({ error: "Internal server error" })
    }
}

export const getMovieComments: Handler = async (req, res) => {
    try {
        const { movieId } = req.params
        if (!movieId) {
            res.status(400).json({ error: "Movie ID is required" })
            return
        }

        const comments = await db.comment.findMany({
            where: { movieId, parentId: null },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                replies: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true
                            }
                        }
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        })

        res.status(200).json(comments)
    } catch (error) {
        res.status(500).json({ error: "Internal server error" })
    }
}

export const deleteComment: Handler = async (req: AuthenticatedRequest, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            res.status(401).json({ error: "Unauthorized" })
            return
        }

        const { commentId } = req.params
        if (!commentId) {
            res.status(400).json({ error: "Comment ID is required" })
            return
        }

        const comment = await db.comment.findUnique({
            where: { id: commentId }
        })

        if (!comment) {
            res.status(404).json({ error: "Comment not found" })
            return
        }

        if (comment.userId !== userId) {
            res.status(403).json({ error: "Forbidden" })
            return
        }

        await db.comment.delete({
            where: { id: commentId }
        })

        res.status(200).json({ message: "Comment deleted" })
    } catch (error) {
        res.status(500).json({ error: "Internal server error" })
    }
}