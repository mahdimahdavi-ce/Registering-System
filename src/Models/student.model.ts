import mongoose from "mongoose";
import { hash, compare } from 'bcrypt';
import { Roles } from "../../auth/auth.roles.dto";

/**
* @swagger
* components:
*   schemas:
*     Student:
*       type: object
*       required:
*         - title
*         - author
*         - finished
*       properties:
*         studentId:
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
*         entranceYear:
*           type: number
*         entranceTerm:
*           type: string
*         GPA:
*           type: number
*         collage:
*           type: string
*         major:
*           type: string
*         createdAt:
*           type: string
*           format: date
 */


interface IStudent {
    firstName: string,
    lastName: string,
    createdAt: Date,
    studentId: string,
    password: string,
    email: string,
    phoneNumber: string,
    role: Roles | any,
    degree: string,
    entranceYear: number,
    entranceTerm: string,
    GPA: number,
    college: string,
    major: string
}

let studentSchema = new mongoose.Schema<IStudent>({
    firstName: String,
    lastName: String,
    createdAt: { type: Date, default: Date.now },
    studentId: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    email: String,
    phoneNumber: { type: String },
    role: { type: String, enum: Roles },
    degree: String,
    entranceYear: Number,
    entranceTerm: String,
    GPA: Number,
    college: String,
    major: String
})

studentSchema.pre(
    'save',
    async function (next) {
        const user = this;
        const hashedPassword = await hash(this.password, 10);

        this.password = hashedPassword;
        next();
    }
);

let StudentModel = mongoose.model<IStudent>("Student", studentSchema)



export { StudentModel, IStudent }
