import { PrismaClient } from "@prisma/client";
import { prisma } from "../controllers/users.controller";
import { Router } from "express"
import { getUsers, postUser } from "../controllers/users.controller";
//import db from '../db/index'
const userRouter = Router();

/**
 * @swagger
 * components:
 *  schemas:
 *    User:
 *      type: object
 *      properties:
 *        id:
 *          type: string
 *          description: the auto-generated id of user
 *        name:
 *          type: string
 *          description: user name
 *      required:
 *        - name
 *      example:
 *        id: gQBOyGbxcQy6tEp0aZ78X
 *        name: User
 *    TaskNotFound:
 *      type: object
 *      properties:
 *        msg:
 *          type: string
 *          description: A message for the not found user
 *      example:
 *        msg: User was not found
 *
 *  parameters:
 *    userId:
 *      in: path
 *      name: id
 *      required: true
 *      schema:
 *        type: string
 *      description: the user id
 */

/**
 * @swagger
 * tags:
 *  name: Users
 */

/**
 * @swagger
 * /users:
 *  get:
 *    summary: Returns a list of users
 *    tags: [Users]
 *    responses:
 *      200:
 *        description: The list of users
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/User'
 */
userRouter.get('/users', getUsers)

/**
 * @swagger
 * /users:
 *  post:
 *    summary: Adding new user
 *    tags: [Users]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/User'
 *    responses:
 *      200:
 *        description: the user was successfully created
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/User'
 *      500:
 *        description: Some server error
 */
userRouter.post('/users', postUser)

export default userRouter