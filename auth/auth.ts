import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import { ExtractJwt, Strategy as JWTstrategy } from 'passport-jwt'
import { IStudent, StudentModel } from '../src/Models/student.model'
import { compare } from 'bcrypt';
import dotenv from 'dotenv';
import { ManagerModel } from '../src/Models/manager.model';
import { ProfessorModel } from '../src/Models/professor.model';
import {redisClient} from '../index'

dotenv.config()

passport.use(
    'signup',
    new LocalStrategy(
        {
            usernameField: 'studentId',
            passwordField: 'password'
        },
        async (studentId, password, done) => {
            try {
                const user = await StudentModel.create({ studentId, password });
                return done(null, {
                    id: user.id,
                    createdAt: user.createdAt
                });
            } catch (error) {
                done(error);
            }
        }
    )
);


passport.use(
    'login',
    new LocalStrategy(
        {
            usernameField: 'username',
            passwordField: 'password'
        },
        async (username, password, done) => {
            const cachedData: any = await redisClient.get(`${username}-${password}`)
            if (cachedData) {
                return done(null, JSON.parse(cachedData))
            } else {
                try {
                    const studentUser: any = await StudentModel.findOne({ studentId: username });
                    if (studentUser) {
                        const validate = await compare(password, studentUser.password)
                        if (!validate) {
                            return done({ message: "Wrong password!" }, false);
                        }
                        await redisClient.set(`${username}-${password}`, JSON.stringify(studentUser))
                        return done(null, studentUser, { message: 'Logged in Successfully' });
                    }

                    const managerUser: any = await ManagerModel.findOne({ managerId: username });
                    if (managerUser) {
                        const validate = await compare(password, managerUser.password)
                        if (!validate) {
                            return done({ message: "Wrong password!" }, false);
                        }
                        await redisClient.set(`${username}-${password}`, JSON.stringify(studentUser))
                        return done(null, managerUser, { message: 'Logged in Successfully' });
                    }

                    const professorUser: any = await ProfessorModel.findOne({ professorId: username });
                    if (professorUser) {
                        const validate = await compare(password, professorUser.password)
                        if (!validate) {
                            return done({ message: "Wrong password!" }, false);
                        }
                        await redisClient.set(`${username}-${password}`, JSON.stringify(studentUser))
                        return done(null, professorUser, { message: 'Logged in Successfully' });
                    }

                    return done({ message: 'User not found' }, false);

                } catch (error) {
                    return done(error);
                }
            }
        }
    )
);

passport.use(
    new JWTstrategy(
        {
            secretOrKey: process.env.JWT_SECRET_KEY,
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
        },
        async (token, done) => {
            try {
                return done(null, token.user);
            } catch (error) {
                done(error);
            }
        }
    )
);