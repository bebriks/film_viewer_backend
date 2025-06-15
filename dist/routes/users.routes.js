"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const users_controller_1 = require("../controllers/users.controller");
const auth_1 = require("../middleware/auth");
const userRouter = (0, express_1.Router)();
/**
 * @swagger
 * components:
 *  securitySchemes:
 *    BearerAuth:
 *      type: http
 *      scheme: bearer
 *      bearerFormat: JWT
 *
 *  schemas:
 *    User:
 *      type: object
 *      properties:
 *        id:
 *          type: string
 *        name:
 *          type: string
 *        email:
 *          type: string
 *        createdAt:
 *          type: string
 *          format: date-time
 *      example:
 *        id: "clabc12345xyz67890"
 *        name: "John Doe"
 *        email: "john@example.com"
 *        createdAt: "2023-05-15T10:00:00Z"
 *
 *    AuthResponse:
 *      type: object
 *      properties:
 *        accessToken:
 *          type: string
 *        refreshToken:
 *          type: string
 *        user:
 *          $ref: '#/components/schemas/User'
 *
 *    Favorite:
 *      type: object
 *      properties:
 *        id:
 *          type: string
 *        userId:
 *          type: string
 *        movieId:
 *          type: string
 *        createdAt:
 *          type: string
 *          format: date-time
 *      example:
 *        id: "fav12345"
 *        userId: "clabc12345xyz67890"
 *        movieId: "tt1234567"
 *        createdAt: "2023-05-15T10:00:00Z"
 *
 *    Comment:
 *      type: object
 *      properties:
 *        id:
 *          type: string
 *        text:
 *          type: string
 *        userId:
 *          type: string
 *        movieId:
 *          type: string
 *        parentId:
 *          type: string
 *          nullable: true
 *        createdAt:
 *          type: string
 *          format: date-time
 *      example:
 *        id: "comment123"
 *        text: "Great movie!"
 *        userId: "clabc12345xyz67890"
 *        movieId: "tt1234567"
 *        parentId: null
 *        createdAt: "2023-05-15T10:00:00Z"
 *
 *    CommentWithUser:
 *      type: object
 *      properties:
 *        id:
 *          type: string
 *        text:
 *          type: string
 *        createdAt:
 *          type: string
 *          format: date-time
 *        user:
 *          type: object
 *          properties:
 *            id:
 *              type: string
 *            name:
 *              type: string
 *        replies:
 *          type: array
 *          items:
 *            $ref: '#/components/schemas/CommentWithUser'
 *
 *    ErrorResponse:
 *      type: object
 *      properties:
 *        error:
 *          type: string
 *      example:
 *        error: "Error message"
 *
 *  parameters:
 *    movieId:
 *      in: path
 *      name: movieId
 *      required: true
 *      schema:
 *        type: string
 *      description: ID фильма
 *    favoriteId:
 *      in: path
 *      name: favoriteId
 *      required: true
 *      schema:
 *        type: string
 *      description: ID избранного
 *    commentId:
 *      in: path
 *      name: commentId
 *      required: true
 *      schema:
 *        type: string
 *      description: ID комментария
 */
/**
 * @swagger
 * tags:
 *  - name: Auth
 *  - name: Profile
 *  - name: Favorites
 *  - name: Comments
 *  - name: Admin
 */
// ====================== Аутентификация ======================
/**
 * @swagger
 * /register:
 *  post:
 *    summary: Регистрация нового пользователя
 *    tags: [Auth]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - name
 *              - email
 *              - password
 *            properties:
 *              name:
 *                type: string
 *              email:
 *                type: string
 *              password:
 *                type: string
 *    responses:
 *      201:
 *        description: Успешная регистрация
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/AuthResponse'
 *      400:
 *        description: Неверные входные данные
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ErrorResponse'
 *      409:
 *        description: Email уже используется
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ErrorResponse'
 */
userRouter.post('/register', users_controller_1.register);
/**
 * @swagger
 * /login:
 *  post:
 *    summary: Вход пользователя
 *    tags: [Auth]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - email
 *              - password
 *            properties:
 *              email:
 *                type: string
 *              password:
 *                type: string
 *    responses:
 *      200:
 *        description: Успешный вход
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/AuthResponse'
 *      400:
 *        description: Неверные входные данные
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ErrorResponse'
 *      401:
 *        description: Неверные учетные данные
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ErrorResponse'
 */
userRouter.post('/login', users_controller_1.login);
/**
 * @swagger
 * /logout:
 *  post:
 *    summary: Выход пользователя
 *    tags: [Auth]
 *    security:
 *      - BearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - refreshToken
 *            properties:
 *              refreshToken:
 *                type: string
 *    responses:
 *      200:
 *        description: Успешный выход
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *      400:
 *        description: Неверный запрос
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ErrorResponse'
 *      401:
 *        description: Неавторизован
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ErrorResponse'
 */
userRouter.post('/logout', auth_1.isAuthenticated, users_controller_1.logout);
// ====================== Профиль пользователя ======================
/**
 * @swagger
 * /profile:
 *  get:
 *    summary: Получить профиль пользователя
 *    tags: [Profile]
 *    security:
 *      - BearerAuth: []
 *    responses:
 *      200:
 *        description: Профиль пользователя
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/User'
 *      401:
 *        description: Неавторизован
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ErrorResponse'
 */
userRouter.get('/profile', auth_1.isAuthenticated, users_controller_1.getProfile);
// ====================== Избранное ======================
/**
 * @swagger
 * /favorites:
 *  get:
 *    summary: Получить избранные фильмы пользователя
 *    tags: [Favorites]
 *    security:
 *      - BearerAuth: []
 *    responses:
 *      200:
 *        description: Список избранных фильмов
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Favorite'
 *      401:
 *        description: Неавторизован
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ErrorResponse'
 */
userRouter.get('/favorites', auth_1.isAuthenticated, users_controller_1.getFavorites);
/**
 * @swagger
 * /favorites:
 *  post:
 *    summary: Добавить фильм в избранное
 *    tags: [Favorites]
 *    security:
 *      - BearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - userId
 *              - movieId
 *            properties:
 *              movieId:
 *                type: number
 *              userId:
 *                type: string
 *    responses:
 *      201:
 *        description: Фильм добавлен в избранное
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Favorite'
 *      400:
 *        description: Неверный запрос
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ErrorResponse'
 *      401:
 *        description: Неавторизован
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ErrorResponse'
 *      409:
 *        description: Фильм уже в избранном
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ErrorResponse'
 */
userRouter.post('/favorites', users_controller_1.addToFavorites);
/**
 * @swagger
 * /favorites/{favoriteId}:
 *  delete:
 *    summary: Удалить фильм из избранного
 *    tags: [Favorites]
 *    security:
 *      - BearerAuth: []
 *    parameters:
 *      - $ref: '#/components/parameters/favoriteId'
 *    responses:
 *      200:
 *        description: Фильм удален из избранного
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *      400:
 *        description: Неверный запрос
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ErrorResponse'
 *      401:
 *        description: Неавторизован
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ErrorResponse'
 *      403:
 *        description: Запрещено
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ErrorResponse'
 *      404:
 *        description: Избранное не найдено
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ErrorResponse'
 */
userRouter.delete('/favorites/:favoriteId', auth_1.isAuthenticated, users_controller_1.removeFromFavorites);
// ====================== Комментарии ======================
/**
 * @swagger
 * /comments:
 *  post:
 *    summary: Создать комментарий
 *    tags: [Comments]
 *    security:
 *      - BearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - movieId
 *              - text
 *            properties:
 *              movieId:
 *                type: string
 *              text:
 *                type: string
 *              parentId:
 *                type: string
 *                nullable: true
 *    responses:
 *      201:
 *        description: Комментарий создан
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Comment'
 *      400:
 *        description: Неверный запрос
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ErrorResponse'
 *      401:
 *        description: Неавторизован
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ErrorResponse'
 */
userRouter.post('/comments', auth_1.isAuthenticated, users_controller_1.createComment);
/**
 * @swagger
 * /movies/{movieId}/comments:
 *  get:
 *    summary: Получить комментарии к фильму
 *    tags: [Comments]
 *    parameters:
 *      - $ref: '#/components/parameters/movieId'
 *    responses:
 *      200:
 *        description: Список комментариев
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/CommentWithUser'
 *      400:
 *        description: Неверный запрос
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ErrorResponse'
 */
userRouter.get('/movies/:movieId/comments', users_controller_1.getMovieComments);
/**
 * @swagger
 * /comments/{commentId}:
 *  delete:
 *    summary: Удалить комментарий
 *    tags: [Comments]
 *    security:
 *      - BearerAuth: []
 *    parameters:
 *      - $ref: '#/components/parameters/commentId'
 *    responses:
 *      200:
 *        description: Комментарий удален
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *      400:
 *        description: Неверный запрос
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ErrorResponse'
 *      401:
 *        description: Неавторизован
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ErrorResponse'
 *      403:
 *        description: Запрещено
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ErrorResponse'
 *      404:
 *        description: Комментарий не найден
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ErrorResponse'
 */
userRouter.delete('/comments/:commentId', auth_1.isAuthenticated, users_controller_1.deleteComment);
// ====================== Админские роуты ======================
/**
 * @swagger
 * /admin/users:
 *  get:
 *    summary: Получить всех пользователей (только админ)
 *    tags: [Admin]
 *    security:
 *      - BearerAuth: []
 *    responses:
 *      200:
 *        description: Список пользователей
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/User'
 *      401:
 *        description: Неавторизован
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ErrorResponse'
 *      403:
 *        description: Доступ запрещен
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ErrorResponse'
 */
userRouter.get('/admin/users', users_controller_1.getUsers);
exports.default = userRouter;
