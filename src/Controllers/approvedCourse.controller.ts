import express, { Express, Request, Response } from 'express';
import { createApprovedCourse, deleteApprovedCourse, UpdateApprovedCourseById, getAllApprovedCourses, getApprovedCourseById } from '../services/approvedCourse.service';
import { authorization } from '../../auth/authorization';
import { Roles } from '../../auth/auth.roles.dto';

const router = express.Router()

/**
 * @swagger
 * tags:
 *   name: ApprovedCourse
 *   description: The approvedCourses managing API
 * /api/approvedcourse:
 *   post:
 *     summary: Create a new approved course
 *     tags: 
 *          - ApprovedCourse
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ApprovedCourse'
 *     responses:
 *       200:
 *         description: The created course.
 *       500:
 *         description: Some server error
 * /api/approvedcourses:
 *   get:
 *     summary: get all approved courses
 *     tags: 
 *          - ApprovedCourse
 *     responses:
 *       200:
 *         description: The approvedcourses are fetched successfully.
 *       500:
 *         description: Some server error
 * /api/approvedcourse/:id:
 *   get:
 *     summary: get a approvedCourse by id
 *     tags: 
 *          - ApprovedCourse
 *     responses:
 *       200:
 *         description: The course is fetched successfully.
 *       500:
 *         description: Some server error
 *   put:
 *     summary: update a approvedCourse by id
 *     tags: 
 *          - ApprovedCourse
 *     responses:
 *       200:
 *         description: The course is updated successfully
 *       500:
 *         description: Some server error
 *   delete:
 *     summary: delete a ApprovedCourse by id
 *     tags: 
 *          - ApprovedCourse 
 *     requestBody:
 *       required: true
 *     responses:
 *       200:
 *         description: The course is deleted successfully
 *       500:
 *         description: Some server error
 *
 */


// Route handlers for Approved Courses
router.post('/api/approvedcourse', authorization(Roles.EducationManager), async (req: Request, res: Response) => {
    let creationResult = await createApprovedCourse(req.body)
    res.status(200).send({
        statusCode: 200,
        data: creationResult
    })
});

router.put('/api/approvedcourse/:id', authorization(Roles.EducationManager), async (req: Request, res: Response) => {
    let updatingResult = await UpdateApprovedCourseById(req.params.id, req.body)
    res.status(200).send({
        statusCode: 200,
        data: updatingResult
    })
});

router.delete('/api/approvedcourse/:id', authorization(Roles.EducationManager), async (req: Request, res: Response) => {
    let deletionResult = await deleteApprovedCourse(req.params.id)
    res.status(200).send({
        statusCode: 200,
        data: deletionResult
    })
});

router.get('/api/approvedcourses', authorization([Roles.ITManager, Roles.EducationManager, Roles.Student, Roles.Professor]), async (req: Request, res: Response) => {
    let fetchingResult = await getAllApprovedCourses()
    res.status(200).send({
        statusCode: 200,
        data: fetchingResult
    })
});

router.get('/api/approvedcourse/:id', authorization([Roles.EducationManager, Roles.Student, Roles.Professor]), async (req: Request, res: Response) => {
    let professor = await getApprovedCourseById(req.params.id)
    res.status(200).send({
        statusCode: 200,
        data: professor
    })
});


export {router as approvedcourseRouter}