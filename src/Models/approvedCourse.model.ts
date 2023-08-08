import mongoose, { Mongoose } from "mongoose";

/**
* @swagger
* components:
*   schemas:
*     ApprovedCourse:
*       type: object
*       required:
*         - title
*         - author
*         - finished
*       properties:
*         Id:
*           type: string
*         CourseName:
*           type: string
*         preRequisites:
*           type: string
*         suRequisites:
*           type: string
*         unit:
*           type: number
*         createdAt:
*           type: string
*           format: date
* 
 */

interface IApprovedCourse {
    courseName: string,
    preRequisites: string[],
    suRequisites: string[],
    unit: number
}


let approvedCourseSchema = new mongoose.Schema<IApprovedCourse>({
    courseName: String,
    preRequisites: [String],
    suRequisites: [String],
    unit: Number
})


let ApprovedCourseModel = mongoose.model<IApprovedCourse>("ApprovedCourse", approvedCourseSchema)

export {ApprovedCourseModel}