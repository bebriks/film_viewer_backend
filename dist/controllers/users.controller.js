"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteComment = exports.getMovieComments = exports.createComment = exports.removeFromFavorites = exports.addToFavorites = exports.logout = exports.register = exports.login = exports.getFavorites = exports.getProfile = exports.getUsers = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const db_1 = require("../db/db");
const user_service_1 = require("../utils/user.service");
const jwt_1 = require("../crypto/jwt");
const auth_service_1 = require("../utils/auth.service");
// Все обработчики должны возвращать void или Promise<void>
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allUsers = yield db_1.db.user.findMany();
        res.status(200).json(allUsers);
    }
    catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.getUsers = getUsers;
const getProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        console.log(userId);
        if (!userId) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }
        const user = yield (0, user_service_1.findUserById)(userId);
        if (!user) {
            res.status(404).json({ error: "User not found" });
            return;
        }
        res.status(200).json({
            id: user.id,
            name: user.name,
            email: user.email,
            createdAt: user.createdAt
        });
    }
    catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.getProfile = getProfile;
const getFavorites = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        if (!userId) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }
        const favorites = yield db_1.db.favorite.findMany({
            where: { userId }
        });
        res.status(200).json(favorites);
    }
    catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.getFavorites = getFavorites;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ error: "Email and password are required" });
        }
        const existingUser = yield (0, user_service_1.findUserByEmail)(email);
        if (!existingUser) {
            return;
        }
        if (!existingUser) {
            res.status(401).json({ error: "Invalid credentials" });
        }
        const validPassword = yield bcryptjs_1.default.compare(password, existingUser.password);
        if (!validPassword) {
            res.status(401).json({ error: "Invalid credentials" });
        }
        const { accessToken, refreshToken } = (0, jwt_1.generateTokens)(existingUser);
        yield (0, auth_service_1.addRefreshTokenToWhitelist)({ refreshToken, userId: existingUser.id });
        res.status(200).json({
            accessToken,
            refreshToken,
            user: {
                id: existingUser.id,
                name: existingUser.name,
                email: existingUser.email
            }
        });
    }
    catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.login = login;
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password } = req.body;
        if (!email || !password || !name) {
            res.status(400).json({ error: "Name, email and password are required" });
            return;
        }
        const salt = yield bcryptjs_1.default.genSalt(10);
        const hashPassword = yield bcryptjs_1.default.hash(password, salt);
        const existedUser = yield (0, user_service_1.findUserByEmail)(email);
        if (existedUser) {
            res.status(409).json({ error: "Email already in use" });
            return;
        }
        const user = yield db_1.db.user.create({
            data: { email, password: hashPassword, name }
        });
        const { accessToken, refreshToken } = (0, jwt_1.generateTokens)(user);
        yield (0, auth_service_1.addRefreshTokenToWhitelist)({ refreshToken, userId: user.id });
        res.status(201).json({
            accessToken,
            refreshToken,
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });
    }
    catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.register = register;
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            res.status(400).json({ error: "Refresh token required" });
            return;
        }
        yield (0, auth_service_1.deleteRefreshToken)(refreshToken);
        res.status(200).json({ message: "Logged out successfully" });
    }
    catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.logout = logout;
const addToFavorites = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, movieId } = req.body;
        if (!userId) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }
        if (!movieId) {
            res.status(400).json({ error: "Movie ID is required" });
            return;
        }
        const existingFavorite = yield db_1.db.favorite.findFirst({
            where: {
                userId,
                movieId
            }
        });
        if (existingFavorite) {
            res.status(409).json({ error: "Movie already in favorites" });
            return;
        }
        const favorite = yield db_1.db.favorite.create({
            data: { userId, movieId }
        });
        res.status(201).json(favorite);
    }
    catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.addToFavorites = addToFavorites;
const removeFromFavorites = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        if (!userId) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }
        const { favoriteId } = req.params;
        if (!favoriteId) {
            res.status(400).json({ error: "Favorite ID is required" });
            return;
        }
        const favorite = yield db_1.db.favorite.findUnique({
            where: { id: favoriteId }
        });
        if (!favorite) {
            res.status(404).json({ error: "Favorite not found" });
            return;
        }
        if (favorite.userId !== userId) {
            res.status(403).json({ error: "Forbidden" });
            return;
        }
        yield db_1.db.favorite.delete({
            where: { id: favoriteId }
        });
        res.status(200).json({ message: "Removed from favorites" });
    }
    catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.removeFromFavorites = removeFromFavorites;
const createComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        if (!userId) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }
        const { movieId, text, parentId } = req.body;
        if (!movieId || !text) {
            res.status(400).json({ error: "Movie ID and text are required" });
            return;
        }
        const comment = yield db_1.db.comment.create({
            data: {
                text,
                userId,
                movieId,
                parentId: parentId || null
            }
        });
        res.status(201).json(comment);
    }
    catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.createComment = createComment;
const getMovieComments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { movieId } = req.params;
        if (!movieId) {
            res.status(400).json({ error: "Movie ID is required" });
            return;
        }
        const comments = yield db_1.db.comment.findMany({
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
        });
        res.status(200).json(comments);
    }
    catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.getMovieComments = getMovieComments;
const deleteComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        if (!userId) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }
        const { commentId } = req.params;
        if (!commentId) {
            res.status(400).json({ error: "Comment ID is required" });
            return;
        }
        const comment = yield db_1.db.comment.findUnique({
            where: { id: commentId }
        });
        if (!comment) {
            res.status(404).json({ error: "Comment not found" });
            return;
        }
        if (comment.userId !== userId) {
            res.status(403).json({ error: "Forbidden" });
            return;
        }
        yield db_1.db.comment.delete({
            where: { id: commentId }
        });
        res.status(200).json({ message: "Comment deleted" });
    }
    catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.deleteComment = deleteComment;
