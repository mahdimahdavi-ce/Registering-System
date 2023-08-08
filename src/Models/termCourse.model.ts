import mongoose from "mongoose";

/**
* @swagger
* components:
*   schemas:
*     TermCourse:
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
*         CourseDate:
*           type: string
*         CourseTime:
*           type: string
*         CourseLocation:
*           type: string
*         ExamDate:
*           type: string
*           format: date
*         Professor:
*           type: string
*         Capacity:
*           type: number
*         Term:
*           type: string
* 
 */

enum Term {
    WINTER,
    SPRING,
    SUMMER
}

interface ITermCourse {
    courseName: string,
    preRequisites: string[],
    suRequisites: string[],
    unit: number,
    courseDate: string[],
    courseTime: string[],
    courseLocation: string,
    examDate: Date,
    professor: string,
    capacity: number,
    term: string,
    termId: string,
    registeredStudents: string[]
}


let termCourseSchema = new mongoose.Schema<ITermCourse>({
    courseName: String,
    preRequisites: [String],
    suRequisites: [String],
    unit: Number,
    courseDate: [String],
    courseTime: [String],
    courseLocation: String,
    examDate: Date,
    professor: String,
    capacity: Number,
    term: String,
    termId: String,
    registeredStudents: [String]
})


let termCourseModel = mongoose.model<ITermCourse>("TermCourse", termCourseSchema)

export { termCourseModel }