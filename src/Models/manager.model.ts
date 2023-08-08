import { hash } from "bcrypt";
import mongoose from "mongoose";
import { Roles } from "../../auth/auth.roles.dto";

/**
* @swagger
* components:
*   schemas:
*     Manager:
*       type: object
*       required:
*         - title
*         - author
*         - finished
*       properties:
*         managerId:
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
*         collage:
*           type: string
*         createdAt:
*           type: string
*           format: date
* 
 */

interface IManager {
    firstName: string,
    lastName: string,
    createdAt: Date,
    managerId: string,
    password: string,
    email: string,
    phoneNumber: string,
    role: Roles | any,
    college: string,
}

let managerSchema = new mongoose.Schema<IManager>({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    createdAt: {type: Date, default: Date.now},
    managerId: {type: String, unique: true, required: true},
    password: String,
    email: {type: String, unique: true},
    phoneNumber: {type: String, unique: true},
    role: { type: String, enum: Roles},
    college: String,
})

managerSchema.pre(
    'save',
    async function (next) {
        const user = this;
        const hashedPassword = await hash(this.password, 10);
        this.password = hashedPassword;
        next();
    }
);

let ManagerModel = mongoose.model<IManager>("Manager", managerSchema)

export {ManagerModel}