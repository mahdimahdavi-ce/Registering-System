import express, { Express, Request, Response } from 'express';
import { acceptTheRegistraionOfAStudent, createProfessor, deleteProfessor, getAllProfessors, getAllRegistrationsForACourse, getAllRegistrationsForASemester, getProfessorById, updateProfessorById } from '../services/professor.service';
import { authorization } from '../../auth/authorization';
import { Roles } from '../../auth/auth.roles.dto';

const router = express.Router()

/**
 * @swagger
 * tags:
 *   name: Professors
 *   description: The professors managing API
 * /api/admin/professor:
 *   post:
 *     summary: Create a new professor
 *     tags: 
 *          - Professors
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Professor'
 *     responses:
 *       200:
 *         description: The created professor.
 *       500:
 *         description: Some server error
 * /api/admin/professors:
 *   get:
 *     summary: get all professors
 *     tags: 
 *          - Professors
 *     responses:
 *       200:
 *         description: The professors are fetched successfully.
 *       500:
 *         description: Some server error
 * /api/admin/professor/:id:
 *   get:
 *     summary: get a professor by id
 *     tags: 
 *          - Professors
 *     responses:
 *       200:
 *         description: The professor is fetched successfully.
 *       500:
 *         description: Some server error
 *   put:
 *     summary: update a professor by id
 *     tags: 
 *          - Professors
 *     responses:
 *       200:
 *         description: The professor is updated successfully
 *       500:
 *         description: Some server error
 *   delete:
 *     summary: delete a professor by id
 *     tags: 
 *          - Professors
 *     requestBody:
 *       required: true
 *     responses:
 *       200:
 *         description: The professor is deleted successfully
 *       500:
 *         description: Some server error
 *
 */


// Route handlers for Professors
router.post('/api/admin/professor', authorization(Roles.ITManager), async (req: Request, res: Response) => {
    let creationResult = await createProfessor(req.body.professors)
        .catch((error) => {
            res.status(500).json({ data: `internal server error` })
        })
    res.status(200).send({
        statusCode: 200,
        data: creationResult
    })
});

router.put('/api/admin/professor/:id', authorization([Roles.ITManager, Roles.Professor]), async (req: Request, res: Response) => {
    let updatingResult = await updateProfessorById(req.params.id, req.body)
        .catch((error) => {
            res.status(404).json({ data: `The professor with given id dosen't exist` })
        })
    res.status(200).send({
        statusCode: 200,
        data: updatingResult
    })
});

router.delete('/api/admin/professor/:id', authorization(Roles.ITManager), async (req: Request, res: Response) => {
    let deletionResult = await deleteProfessor(req.params.id)
        .catch((error) => {
            res.status(500).json({ data: `internal server error` })
        })
    res.status(200).send({
        statusCode: 200,
        data: deletionResult
    })
});

router.get('/api/admin/professors', authorization([Roles.ITManager, Roles.EducationManager]), async (req: Request, res: Response) => {
    let fetchingResult = await getAllProfessors(req.query.search)
        .catch((error) => {
            res.status(500).json({ data: `internal server error` })
        })
    res.status(200).send({
        statusCode: 200,
        data: fetchingResult
    })
});

router.get('/api/admin/professor/:id', authorization([Roles.ITManager, Roles.EducationManager]), async (req: Request, res: Response) => {
    let professor = await getProfessorById(req.params.id)
        .catch((error) => {
            res.status(404).json({ data: `The professor with given id dosen't exist` })
        })
    res.status(200).send({
        statusCode: 200,
        data: professor
    })
});

// Endpoints for the HW3

router.get('/api/term/:id/termregistrations', authorization([Roles.Professor]), async (req: Request, res: Response) => {
    const allRegistrations = await getAllRegistrationsForASemester(req.params.id)
    res.status(200).send({
        statusCode: 200,
        data: allRegistrations
    })
})

router.get('/api/course/:id/registrations', authorization([Roles.Professor]), async (req: Request, res: Response) => {
    const allRegistrations = await getAllRegistrationsForACourse(req.params.id)
    res.status(200).send({
        statusCode: 200,
        studentsIds: allRegistrations
    })
})

router.put('/api/registration/:id',authorization([Roles.Professor, Roles.EducationManager]), async (req: Request, res: Response) => {
    const acceptanceResult = await acceptTheRegistraionOfAStudent(req.params.id, req.body.termId, req.body.status, req.user)
    res.status(200).send({
        statusCode: 200,
        studentsIds: acceptanceResult
    })
})



export { router as professorRouter }



