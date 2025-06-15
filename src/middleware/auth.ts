import { Handler, Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { AuthenticatedRequest } from '../types/express';

export const isAuthenticated: Handler = (req: AuthenticatedRequest, res, next) => {
    const { authorization } = req.headers;
  
    if (!authorization) {
      res.status(401);
      throw new Error('Unauthorized');
    }
  
    try {
      const token = authorization.split(' ')[1];
      const payload = jwt.verify(token, String(process.env.JWT_SECRET)) as { userId: string, iat: number, exp: number };
      req.user = payload
    } catch (err) {
      res.status(401);
      throw new Error('Unauthorized');
    }
  
    return next();
}

export const verifyUserToken: Handler = (req, res, next) => {
    let token = req.headers.authorization;

    if (!token) res.status(401).send("Access Denied / Unauthorized request");

    try {
        token = token?.split(' ')[1]

        if (token === 'null' || !token) res.status(401).send('Unauthorized request');

        let verifiedUser = token && jwt.verify(token, String(process.env.JWT_SECRET));
        if (!verifiedUser) res.status(401).send('Unauthorized request')

        req.body.user = verifiedUser;
        next();

    } catch (error) {
      res.status(400).send("Invalid Token");
    }

}

export const isAdmin: Handler = async(req, res, next) => {
    const { user } = req.body
    if (user.user_type_id === 1) {
        res.status(200).send(user)
    }
    res.status(401).send("Unauthorized!");
}