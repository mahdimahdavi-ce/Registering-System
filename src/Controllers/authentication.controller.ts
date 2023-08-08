import express, { Express, Request, Response } from 'express';
const router = express.Router();
import passport from 'passport';
import { sign } from 'jsonwebtoken';
require('../../auth/auth');
import * as jwt from 'jsonwebtoken';
import jwt_decode from 'jwt-decode';

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: The login/register managing API
 * paths:
 *  /login:
 *    post:
 *      summary: login a user
 *      tags: 
 *          - Auth
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Manager'
 *      responses:
 *        200:
 *          description: The credentials are incorrect.
 *        500:
 *          description: Some server error
 *  /signup:
 *    post:
 *      summary: register a new user
 *      tags: 
 *          - Auth
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Manager'
 *      responses:
 *        200:
 *          description: The credentials are incorrect.
 *        500:
 *          description: Some server error
 */

router.post('/signup', passport.authenticate('signup', { session: false }),
    async (req: Request, res: Response, next) => {
        res.json({
            message: 'Signup successful',
            user: req.user
        });
    })


router.post('/login', async (req, res, next) => {
    passport.authenticate('login', async (err: any, user: any, info: any) => {
        try {
            if (err || !user) {
                res.json({
                    error: err.message
                })
            }

            req.login(
                user, { session: false },
                async (error) => {
                    if (error) return next(error);
                    const jwtSecretKey: any = process.env.JWT_SECRET_KEY
                    const body = { _id: user._id, role: user.role };
                    const token = sign({ user: body }, jwtSecretKey);

                    return res.json({ token });
                }
            );
        } catch (error) {
            return next(error);
        }
    }
    )(req, res, next);
}
);

router.post('/parsetoken', async (req, res) => {
    const token = req.body.token
    const secret: any = process.env.JWT_SECRET_KEY
    const parsedToken: any = jwt.verify(token, secret, { ignoreExpiration: true })
    res.status(200).json({
        token: parsedToken.user
    })
})

export { router as authRouter }