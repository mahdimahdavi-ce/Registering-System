import express, { Express, Request, Response } from 'express';
import {
    deletePreRegisterRequest,
    addPreRegistrationRequest,
    createStudent,
    deleteStudent,
    getAllStudents,
    getStudentById,
    updateStudentById,
    addRegistrationRequest,
    deleteRegistrationRequest,
    getAllRegistratinos
} from '../services/student.service';
import { authorization } from '../../auth/authorization';
import { Roles } from '../../auth/auth.roles.dto';
import { preRegistrationReport } from '../services/term.service';
import passport from 'passport';

const router = express.Router()

/**
 * @swagger
 * tags:
 *   name: Students
 *   description: The students managing API
 * /api/admin/student:
 *   post:
 *     summary: Create a new Student
 *     tags: 
 *          - Students
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Student'
 *     responses:
 *       200:
 *         description: The created student.
 *       500:
 *         description: Some server error
 * /api/admin/students:
 *   get:
 *     summary: get all students
 *     tags: 
 *          - Students
 *     responses:
 *       200:
 *         description: The students are fetched successfully.
 *       500:
 *         description: Some server error
 * /api/admin/student/:id:
 *   get:
 *     summary: get a student by id
 *     tags: 
 *          - Students
 *     responses:
 *       200:
 *         description: The student is fetched successfully.
 *       500:
 *         description: Some server error
 *   put:
 *     summary: update a student by id
 *     tags: 
 *          - Students
 *     responses:
 *       200:
 *         description: The student is updated successfully
 *       500:
 *         description: Some server error
 *   delete:
 *     summary: delete a student by id
 *     tags: 
 *          - Students
 *     requestBody:
 *       required: true
 *     responses:
 *       200:
 *         description: The student is deleted successfully
 *       500:
 *         description: Some server error
 *
 */

// Route handlers for Students
router.post('/api/admin/student', authorization(Roles.ITManager), async (req: Request, res: Response) => {
    let creationResult = await createStudent(req.body.students)
        .catch((error) => {
            res.status(500).json({ data: `Internal server error` })
        })
    res.status(200).send({
        statusCode: 200,
        data: creationResult
    })
});

router.put('/api/admin/student/:id', authorization([Roles.ITManager, Roles.Student]), async (req: Request, res: Response) => {
    let updatingResult = await updateStudentById(req.params.id, req.body)
        .catch((error) => {
            res.status(404).json({ data: `The student with given id dosen't exist` })
        })
    res.status(200).send({
        statusCode: 200,
        data: updatingResult
    })
});

router.delete('/api/admin/student/:id', authorization(Roles.ITManager), async (req: Request, res: Response) => {
    let deletionResult = await deleteStudent(req.params.id)
        .catch((error) => {
            res.status(500).json({ data: `Internal server error` })
        })
    res.status(200).send({
        statusCode: 200,
        data: deletionResult
    })
});

router.get('/api/admin/students', authorization([Roles.ITManager, Roles.Student]), async (req: Request, res: Response) => {
    let fetchingResult = await getAllStudents(req.query.search)
        .catch((error) => {
            res.status(500).json({ data: `Internal server error` })
        })
    res.status(200).send({
        statusCode: 200,
        data: fetchingResult
    })
});

router.get('/api/admin/student/:id', authorization([Roles.ITManager, Roles.Student, Roles.Student]), async (req: Request, res: Response) => {
    let professor = await getStudentById(req.params.id)
        .catch((error) => {
            res.status(404).json({ data: `The student with given id dosen't exist` })
        })
    res.status(200).send({
        statusCode: 200,
        data: professor
    })
});

// Endpoints for the HW3


router.post('/api/course/preregister/:id', authorization([Roles.Student]), async (req: Request, res: Response) => {
    const preRegistrationResult = await addPreRegistrationRequest(req.user, req.params.id, req.body.courses)
    res.status(200).json({
        statusCode: 200,
        data: preRegistrationResult
    })
})

router.delete('/api/course/preregister/:id', authorization([Roles.Student]), async (req: Request, res: Response) => {
    const deletionResult = await deletePreRegisterRequest(req.user, req.params.id)
    res.status(200).json({
        statusCode: 200,
        data: deletionResult
    }) 
})

router.post('/api/course/register/:id', authorization([Roles.Student]), async (req: Request, res: Response) => {
    const registrationResult = await addRegistrationRequest(req.user, req.params.id, req.body.course)
    res.status(200).json({
        statusCode: 200,
        data: registrationResult
    })
})

router.delete('/api/course/register/:id', authorization([Roles.Student]), async (req: Request, res: Response) => {
    const registrationResult = await deleteRegistrationRequest(req.user, req.params.id, req.body.course)
    res.status(200).json({
        statusCode: 200,
        data: registrationResult
    })
})

router.get('/api/term/:id/registrations', authorization([Roles.Student]), async (req: Request, res: Response) => {
    const registrationResult = await getAllRegistratinos(req.user, req.params.id)
    res.status(200).json({
        statusCode: 200,
        data: registrationResult
    })
})

export { router as studentRouter }