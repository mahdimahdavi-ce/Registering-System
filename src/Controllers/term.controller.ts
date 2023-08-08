import express, { Express, Request, Response } from 'express';
import {addNewCourseToPreReg, addNewCourseToReg, createTerm, deleteCourseFromPreReg, deleteCourseFromReg, deleteTerm, getAllTerms, getTermById, preRegistrationOfACourse, preRegistrationReport, returnAllPreRegCourses, returnAllRegCourses, updateTermById} from '../services/term.service'
import { authorization } from '../../auth/authorization';
import { Roles } from '../../auth/auth.roles.dto';

const router = express.Router()


/**
 * @swagger
 * tags:
 *   name: Terms
 *   description: The terms managing API
 * /api/term/:
 *   post:
 *     summary: Create a new term
 *     tags: 
 *          - Terms
 *     responses:
 *       200:
 *         description: The created student.
 *       500:
 *         description: Some server error
 * /api/term/:id:
 *   put:
 *     summary: Create a new term
 *     tags: 
 *          - Terms
 *     responses:
 *       200:
 *         description: The created student.
 *       500:
 *         description: Some server error
 *    delete:
 *     summary: Create a new term
 *     tags: 
 *          - Terms
 *     responses:
 *       200:
 *         description: The created student.
 *       500:
 *         description: Some server error
 * 
 * /api/terms:
 *   get:
 *     summary: Create a new term
 *     tags: 
 *          - Terms
 *     responses:
 *       200:
 *         description: The created student.
 *       500:
 *         description: Some server error
 * 
 * */


// Route handlers for Term Courses
router.post('/api/term', authorization([Roles.EducationManager]), async (req: Request, res: Response) => {
    let creationResult = await createTerm(req.body)
    res.status(200).send({
        statusCode: 200,
        data: creationResult
    })
});

router.put('/api/term/:id', authorization([Roles.EducationManager]), async (req: Request, res: Response) => {
    let updatingResult = await updateTermById(req.params.id, req.body)
    res.status(200).send({
        statusCode: 200,
        data: updatingResult
    })
});

router.delete('/api/term/:id', authorization([Roles.EducationManager]), async (req: Request, res: Response) => {
    let deletionResult = await deleteTerm(req.params.id)
    res.status(200).send({
        statusCode: 200,
        data: deletionResult
    })
});

// You need to give access of this endpoint to students and professors too!
router.get('/api/terms', authorization([Roles.EducationManager, Roles.Student, Roles.Professor]), async (req: Request, res: Response) => {
    let fetchingResult = await getAllTerms()
    res.status(200).send({
        statusCode: 200,
        data: fetchingResult
    })
});

router.get('/api/term/:id', authorization([Roles.EducationManager]), async (req: Request, res: Response) => {
    let professor = await getTermById(req.params.id)
    res.status(200).send({
        statusCode: 200,
        data: professor
    })
});

router.post('/api/term/:id/preregistration', authorization([Roles.EducationManager]), async (req: Request, res: Response) => {
    let creationResult = await addNewCourseToPreReg(req.params.id, req.body.courses)
    res.status(200).send({
        statusCode: 200,
        data: creationResult
    })
})

router.get('/api/term/:id/preregistration_courses', authorization([Roles.EducationManager, Roles.Student]), async (req: Request, res: Response) => {
    let fetchResult = await returnAllPreRegCourses(req.params.id, req.query.search)
    res.status(200).send({
        statusCode: 200,
        courses: fetchResult
    })
})

router.delete('/api/term/:id/preregistration', authorization([Roles.EducationManager, Roles.Student]), async (req: Request, res: Response) => {
    let deletionResult = await deleteCourseFromPreReg(req.params.id, req.body.course)
    res.status(200).send({
        statusCode: 200,
        data: deletionResult
    })
})

// You need to give access of this endpoint to students too!
router.get('/api/term/:id/preregistrations', authorization([Roles.EducationManager, Roles.Student]), async (req: Request, res: Response) => {
    let preRegReport = await preRegistrationReport(req.params.id)
    res.status(200).send({
        statusCode: 200,
        preRegistraions: preRegReport
    })
})

router.get('/api/course/:id/preregistrations', authorization([Roles.EducationManager]), async (req: Request, res: Response) => {
    let preRegReport = await preRegistrationOfACourse(req.params.id, req.query.course)
    res.status(200).send({
        statusCode: 200,
        data: preRegReport
    })
})

router.post('/api/term/:id/registration', authorization([Roles.EducationManager]), async (req: Request, res: Response) => {
    let creationResult = await addNewCourseToReg(req.params.id, req.body.courses)
    res.status(200).send({
        statusCode: 200,
        data: creationResult
    })
})

// You need to give access of this endpoint to students too!
router.get('/api/term/:id/registration_courses', authorization([Roles.EducationManager, Roles.Student]), async (req: Request, res: Response) => {
    let fetchResult = await returnAllRegCourses(req.params.id, req.query.search)
    res.status(200).send({
        statusCode: 200,
        courses: fetchResult
    })
})

router.delete('/api/term/:id/registration', authorization([Roles.EducationManager]), async (req: Request, res: Response) => {
    let deletionResult = await deleteCourseFromReg(req.params.id, req.body.course)
    res.status(200).send({
        statusCode: 200,
        data: deletionResult
    })
})


export {router as termRouter}