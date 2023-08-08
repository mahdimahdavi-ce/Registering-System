import express, { Express, Request, Response } from 'express';
import { createTermCourse, UpdateTermCourseById, deleteTermCourse, getAllTermCourses, getTermCourseById } from '../services/termCourse.service';
import { authorization } from '../../auth/authorization';
import { Roles } from '../../auth/auth.roles.dto';

const router = express.Router()

/**
 * @swagger
 * tags:
 *   name: TermCourse
 *   description: The termcourse managing API
 * /api/termcourse:
 *   post:
 *     summary: Create a new termcourse course
 *     tags: 
 *          - TermCourse
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TermCourse'
 *     responses:
 *       200:
 *         description: The created course.
 *       500:
 *         description: Some server error
 * /api/termcourses:
 *   get:
 *     summary: get all termCourses
 *     tags: 
 *          - TermCourse
 *     responses:
 *       200:
 *         description: The termCourses are fetched successfully.
 *       500:
 *         description: Some server error
 * /api/termcourse/:id:
 *   get:
 *     summary: get a termCourse by id
 *     tags: 
 *          - TermCourse
 *     responses:
 *       200:
 *         description: The course is fetched successfully.
 *       500:
 *         description: Some server error
 *   put:
 *     summary: update a termCourse by id
 *     tags: 
 *          - TermCourse
 *     responses:
 *       200:
 *         description: The course is updated successfully
 *       500:
 *         description: Some server error
 *   delete:
 *     summary: delete a termCourse by id
 *     tags: 
 *          - TermCourse 
 *     requestBody:
 *       required: true
 *     responses:
 *       200:
 *         description: The course is deleted successfully
 *       500:
 *         description: Some server error
 *
 */

// Route handlers for Term Courses
router.post('/api/termcourse', authorization(Roles.EducationManager), async (req: Request, res: Response) => {
    let creationResult = await createTermCourse(req.body)
    res.status(200).send({
        statusCode: 200,
        data: creationResult
    })
});

router.put('/api/termcourse/:id', authorization(Roles.EducationManager), async (req: Request, res: Response) => {
    let updatingResult = await UpdateTermCourseById(req.params.id, req.body)
    res.status(200).send({
        statusCode: 200,
        data: updatingResult
    })
});

router.delete('/api/termcourse/:id', authorization(Roles.EducationManager), async (req: Request, res: Response) => {
    let deletionResult = await deleteTermCourse(req.params.id)
    res.status(200).send({
        statusCode: 200,
        data: deletionResult
    })
});

router.get('/api/termcourses', authorization([Roles.ITManager, Roles.EducationManager, Roles.Student, Roles.Professor]), async (req: Request, res: Response) => {
    let fetchingResult = await getAllTermCourses()
    res.status(200).send({
        statusCode: 200,
        data: fetchingResult
    })
});

router.get('/api/termcourse/:id', authorization([Roles.EducationManager, Roles.Student, Roles.Professor]), async (req: Request, res: Response) => {
    let professor = await getTermCourseById(req.params.id)
    res.status(200).send({
        statusCode: 200,
        data: professor
    })
});


export {router as termCourseRouter}