// @ts-check
import express from 'express';
import { authenticateToken } from '../actions/auth.js';
import { createInterview, getAllInterviews, getInterviewsByRecruit, getInterviewsByJobOffer, getInterviewById, updateInterview, deleteInterview } from '../actions/interviews.js';

const interviewRouter = express.Router();

interviewRouter.use(authenticateToken);

/**
 * @swagger
 * tags:
 *   - name: Interview
 *     description: API endpoints to manage interviews
 */

/**
 * @swagger
 * /interviews:
 *   post:
 *     summary: Create a new interview
 *     tags: [Interview]
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
 *               date:
 *                 type: string
 *                 format: date-time
 *                 description: Date and time of the interview
 *               status:
 *                 type: string
 *                 description: Status of the interview
 *     responses:
 *       200:
 *         description: Interview successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Interview'
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
interviewRouter.post('/', async (req, res) => { 
  try {
    const interviewData = req.body;
    const newInterview = await createInterview(interviewData);
    res.json(newInterview);
  } catch (error) {
    res.status(400).json({ error: error.message });
} });

/**
 * @swagger
 * /interviews:
 *   get:
 *     summary: Get all interviews
 *     tags: [Interview]
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
 *                 $ref: '#/components/schemas/Interview'
 *       400:
 *         description: Invalid request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
interviewRouter.get('/', async (req, res) => {
  try {
    const interviews = await getAllInterviews();
    res.json(interviews);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * @swagger
 * /interviews/recruit/{recruitId}:
 *   get:
 *     summary: Get interviews for a specific recruit
 *     tags: [Interview]
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
 *                 $ref: '#/components/schemas/Interview'
 *       400:
 *         description: Invalid request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
interviewRouter.get('/recruit/:recruitId', async (req, res) => {
  try {
    const recruitId = parseInt(req.params.recruitId, 10);
    const interviews = await getInterviewsByRecruit(recruitId);
    res.json(interviews);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * @swagger
 * /interviews/job-offer/{jobOfferId}:
 *   get:
 *     summary: Get interviews for a specific job offer
 *     tags: [Interview]
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
 *                 $ref: '#/components/schemas/Interview'
 *       400:
 *         description: Invalid request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
interviewRouter.get('/job-offer/:jobOfferId', async (req, res) => {
  try {
    const jobOfferId = parseInt(req.params.jobOfferId, 10);
    const interviews = await getInterviewsByJobOffer(jobOfferId);
    res.json(interviews);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * @swagger
 * /interviews/{id}:
 *   get:
 *     summary: Get an interview by ID
 *     tags: [Interview]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the interview
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Interview'
 *       400:
 *         description: Invalid request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
interviewRouter.get('/:id', async (req, res) => {
  try {
    const interviewId = parseInt(req.params.id, 10);
    const interview = await getInterviewById(interviewId);
    res.json(interview);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * @swagger
 * /interviews/{id}:
 *   put:
 *     summary: Update an interview
 *     tags: [Interview]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the interview
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               date:
 *                 type: string
 *                 format: date-time
 *                 description: New date and time of the interview
 *               status:
 *                 type: string
 *                 description: New status of the interview
 *     responses:
 *       200:
 *         description: Interview successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Interview'
 *       400:
 *         description: Invalid request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
interviewRouter.put('/:id', async (req, res) => {
  try {
    const interviewId = parseInt(req.params.id, 10);
    const updateData = req.body;
    const updatedInterview = await updateInterview(interviewId, updateData);
    res.json(updatedInterview);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * @swagger
 * /interviews/{id}:
 *   delete:
 *     summary: Delete an interview
 *     tags: [Interview]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the interview
 *     responses:
 *       200:
 *         description: Interview successfully deleted
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
interviewRouter.delete('/:id', async (req, res) => {
  try {
    const interviewId = parseInt(req.params.id, 10);
    const deletedInterview = await deleteInterview(interviewId);
    res.json(deletedInterview);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default interviewRouter;
