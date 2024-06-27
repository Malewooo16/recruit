// @ts-check
import express from 'express';
import { authenticateToken } from '../actions/auth.js';
import { createApplication, getAllApplications, getApplicationsByRecruit, getApplicationsByJobOffer, getApplicationById, updateApplicationStatus, deleteApplication } from '../actions/applications.js';



const applicationRouter = express.Router();

applicationRouter.use(authenticateToken);

/**
 * @swagger
 * tags:
 *   - name: Application
 *     description: API endpoints to manage job applications
 */

/**
 * @swagger
 * /applications:
 *   post:
 *     summary: Create a new application
 *     tags: [Application]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               recruitId:
 *                 type: integer
 *                 description: ID of the recruit
 *               jobOfferId:
 *                 type: integer
 *                 description: ID of the job offer
 *               status:
 *                 type: string
 *                 description: Status of the application
 *     responses:
 *       200:
 *         description: Application successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Application'
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
applicationRouter.post('/', async (req, res) => {
  try {
    const applicationData = req.body;
    const newApplication = await createApplication(applicationData);
    res.json(newApplication);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * @swagger
 * /applications:
 *   get:
 *     summary: Get all applications (for system admin)
 *     tags: [Application]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Application'
 *       400:
 *         description: Invalid request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
applicationRouter.get('/', async (req, res) => {
  try {
    const applications = await getAllApplications();
    res.json(applications);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * @swagger
 * /applications/recruit/{recruitId}:
 *   get:
 *     summary: Get all applications for a specific recruit
 *     tags: [Application]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: recruitId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the recruit
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Application'
 *       400:
 *         description: Invalid request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
applicationRouter.get('/recruit/:recruitId', async (req, res) => {
  try {
    const recruitId = parseInt(req.params.recruitId, 10);
    const applications = await getApplicationsByRecruit(recruitId);
    res.json(applications);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * @swagger
 * /applications/jobOffer/{jobOfferId}:
 *   get:
 *     summary: Get all applications for a specific job offer
 *     tags: [Application]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: jobOfferId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the job offer
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Application'
 *       400:
 *         description: Invalid request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
applicationRouter.get('/jobOffer/:jobOfferId', async (req, res) => {
  try {
    const jobOfferId = parseInt(req.params.jobOfferId, 10);
    const applications = await getApplicationsByJobOffer(jobOfferId);
    res.json(applications);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * @swagger
 * /applications/{id}:
 *   get:
 *     summary: Get an application by ID
 *     tags: [Application]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the application
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Application'
 *       400:
 *         description: Invalid request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
applicationRouter.get('/:id', async (req, res) => {
  try {
    const applicationId = parseInt(req.params.id, 10);
    const application = await getApplicationById(applicationId);
    res.json(application);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * @swagger
 * /applications/{id}:
 *   put:
 *     summary: Update application status
 *     tags: [Application]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the application
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 description: New status of the application
 *     responses:
 *       200:
 *         description: Application status successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Application'
 *       400:
 *         description: Invalid request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
applicationRouter.put('/:id', async (req, res) => {
  try {
    const applicationId = parseInt(req.params.id, 10);
    const { status } = req.body;
    const updatedApplication = await updateApplicationStatus(applicationId, status);
    res.json(updatedApplication);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * @swagger
 * /applications/{id}:
 *   delete:
 *     summary: Delete an application by ID
 *     tags: [Application]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the application
 *     responses:
 *       200:
 *         description: Application successfully deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message
 *       400:
 *         description: Invalid request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
applicationRouter.delete('/:id', async (req, res) => {
  try {
    const applicationId = parseInt(req.params.id, 10);
    const deletedApplication = await deleteApplication(applicationId);
    res.json(deletedApplication);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


export default applicationRouter
