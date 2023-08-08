import { hash } from "bcrypt";
import mongoose from "mongoose";
import { Roles } from "../../auth/auth.roles.dto";

/**
* @swagger
* components:
*   schemas:
*     Professor:
*       type: object
*       required:
*         - title
*         - author
*         - finished
*       properties:
*         professorId:
*           type: string
*         firstName:
*           type: string
*         lastName:
*           type: string
*         password:
*           type: string
*         email:
*           type: string
*         phoneNumber:
*           type: string
*         role:
*           type: string
*         degree:
*           type: string
*         collage:
*           type: string
*         major:
*           type: string
*         createdAt:
*           type: string
*           format: date
* 
 */

interface IProfessor {
    firstName: string,
    lastName: string,
    createdAt: Date,
    professorId: string,
    password: string,
    email: string,
    phoneNumber: string,
    role: Roles | any,
    college: string,
    major: string,
    professorDegree: string
}

let professorSchema = new mongoose.Schema<IProfessor>({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    createdAt: {type: Date, default: Date.now},
    professorId: {type: String, unique: true, required: true},
    password: String,
    email: {type: String, unique: true},
    phoneNumber: {type: String, unique: true},
    role: { type: String, enum: Roles},
    college: String,
    major: String,
    professorDegree: String
})

professorSchema.pre(
    'save',
    async function (next) {
        const user = this;
        const hashedPassword = await hash(this.password, 10);

        this.password = hashedPassword;
        next();
    }
);

let ProfessorModel = mongoose.model<IProfessor>("Professor", professorSchema)

export {ProfessorModel}