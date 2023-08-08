import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose'; import { studentRouter } from './src/Controllers/student.controller';
import { professorRouter } from './src/Controllers/professor.controller';
import { managerRouter } from './src/Controllers/manager.controller';
import { authRouter } from './src/Controllers/authentication.controller';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import passport from 'passport';
import { approvedcourseRouter } from "./src/Controllers/approvedCourse.controller";
import { termCourseRouter } from "./src/Controllers/termCourse.controller";
import { termRouter } from './src/Controllers/term.controller';
import cors from 'cors';
import * as redis from 'redis';
require('./auth/auth');

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "University Automation",
            version: "0.1.0",
            description:
                "This is a simple project which is intended to implment the basic operations in university system",
            license: {
                name: "MIT",
                url: "https://spdx.org/licenses/MIT.html",
            },
        },
        servers: [
            {
                url: "http://localhost:3000",
            },
        ],
    },
    apis: ["./src/Models/*.ts", "./src/Controllers/*.ts"],
};


const specs = swaggerJsdoc(options);
app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(specs, { explorer: true })
);
app.use(cors());
app.use(express.json())
//public routes for authentication
app.use(authRouter)
//secure routes
app.use(passport.authenticate('jwt', { session: false }), termRouter)
app.use(passport.authenticate('jwt', { session: false }), studentRouter)
app.use(passport.authenticate('jwt', { session: false }), professorRouter)
app.use(passport.authenticate('jwt', { session: false }), managerRouter)
app.use(passport.authenticate('jwt', { session: false }), termCourseRouter)
app.use(passport.authenticate('jwt', { session: false }), approvedcourseRouter)

app.use(function (err: any, req: any, res: any, next: any) {
    res.status(err.status || 500);
    res.json({ error: err });
});

// configuring mongoDB
//@ts-ignore
mongoose.connect(process.env.MONGODB_URL)

mongoose.connection.on("error", (err) => {
    console.log("err", err);
});

mongoose.connection.on("connected", (err, res) => {
    console.log("⚡️[mongoose]: mongoose is connected");
});

// configuring redis
let redisClient: any
(async () => {
    redisClient = redis.createClient({
        url: "redis://127.0.0.1:6379"
    })

    redisClient.on('error', (error: any) => {
        console.log(error)
    })

    await redisClient.connect()
})();

app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});

export {redisClient}

