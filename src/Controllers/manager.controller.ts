import express, { Express, Request, Response } from 'express';
import { createManager, updateManagerById, deleteManager, getAllManagers, getManagerById } from '../services/manager.service'
import { authorization } from '../../auth/authorization';
import { Roles } from '../../auth/auth.roles.dto';
const router = express.Router()

/**
 * @swagger
 * tags:
 *   name: Managers
 *   description: The managers managing API
 * /api/admin/Manager:
 *   post:
 *     summary: Create a new manager
 *     tags: 
 *          - Managers
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Manager'
 *     responses:
 *       200:
 *         description: The created manager.
 *       500:
 *         description: Some server error
 * /api/admin/managers:
 *   get:
 *     summary: get all managers
 *     tags: 
 *          - Managers
 *     responses:
 *       200:
 *         description: The managers are fetched successfully.
 *       500:
 *         description: Some server error
 * /api/admin/managers/:id:
 *   get:
 *     summary: get a manager by id
 *     tags: 
 *          - Managers
 *     responses:
 *       200:
 *         description: The manager is fetched successfully.
 *       500:
 *         description: Some server error
 *   put:
 *     summary: update a manager by id
 *     tags: 
 *          - Managers
 *     responses:
 *       200:
 *         description: The manager is updated successfully
 *       500:
 *         description: Some server error
 *   delete:
 *     summary: delete a manager by id
 *     tags: 
 *          - Managers 
 *     requestBody:
 *       required: true
 *     responses:
 *       200:
 *         description: The manager is deleted successfully
 *       500:
 *         description: Some server error
 *
 */

router.post('/api/admin/manager', authorization(Roles.ITManager), async (req: Request, res: Response) => {
    let creationResult = await createManager(req.body.managers)
        .catch((error) => {
            res.status(500).json({ data: "Internal server error" })
        })
    res.status(200).send({
        statusCode: 200,
        data: creationResult
    })
});

router.put('/api/admin/manager/:id', authorization(Roles.ITManager), async (req: Request, res: Response) => {
    let updatingResult = await updateManagerById(req.params.id, req.body)
        .catch((error) => {
            res.status(404).json({ data: `The manager with given id dosen't exist` })
        })
    res.status(200).send({
        statusCode: 200,
        data: updatingResult
    })
});

router.delete('/api/admin/manager/:id', authorization(Roles.ITManager), async (req: Request, res: Response) => {
    let deletionResult = await deleteManager(req.params.id)
        .catch((error) => {
            res.status(500).json({ data: "Internal server error" })
        })
    res.status(200).send({
        statusCode: 200,
        data: deletionResult
    })
});

router.get('/api/admin/managers', authorization(Roles.ITManager), async (req: Request, res: Response) => {
    let fetchingResult = await getAllManagers()
        .catch((error) => {
            res.status(500).json({ data: "Internal server error" })
        })
    res.status(200).send({
        statusCode: 200,
        data: fetchingResult
    })
});

router.get('/api/admin/manager/:id', authorization(Roles.ITManager), async (req: Request, res: Response) => {
    let professor = await getManagerById(req.params.id)
        .catch((error) => {
            res.status(404).json({ data: `The manager with given id dosen't exist` })
        })
    res.status(200).send({
        statusCode: 200,
        data: professor
    })
});

export { router as managerRouter }