// @ts-check
import express from 'express';
import { createJobOffer, getJobOffer, updateJobOffer, deleteJobOffer, getAllJobOffers } from '../actions/joboffers';
import { authenticateToken } from '../actions/auth';

const jobOfferRouter = express.Router();

jobOfferRouter.use(authenticateToken);

/**
 * @swagger
 * tags:
 *   - name: JobOffer
 *     description: API endpoints to manage job offers
 */

/**
 * @swagger
 * /joboffers:
 *   post:
 *     summary: Create a new job offer
 *     tags: [JobOffer]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Job offer title
 *               description:
 *                 type: string
 *                 description: Job offer description
 *               location:
 *                 type: string
 *                 description: Job location
 *               salary:
 *                 type: number
 *                 description: Job salary
 *     responses:
 *       200:
 *         description: Job offer successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/JobOffer'
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
jobOfferRouter.post('/', async (req, res) => {
  try {
    const recruiterId = req.user.id;
    const newJobOffer = await createJobOffer(recruiterId, req.body);
    res.json(newJobOffer);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * @swagger
 * /joboffers/{id}:
 *   get:
 *     summary: Get a job offer by ID
 *     tags: [JobOffer]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
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
 *               $ref: '#/components/schemas/JobOffer'
 *       404:
 *         description: Job offer not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       400:
 *         description: Invalid request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
jobOfferRouter.get('/:id', async (req, res) => {
  try {
    const recruiterId = req.user.id;
    const jobOfferId = parseInt(req.params.id, 10);
    const jobOffer = await getJobOffer(jobOfferId, recruiterId);
    if (!jobOffer) {
      return res.status(404).json({ error: 'Job offer not found' });
    }
    res.json(jobOffer);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * @swagger
 * /joboffers/{id}:
 *   put:
 *     summary: Update a job offer by ID
 *     tags: [JobOffer]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the job offer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Job offer title
 *               description:
 *                 type: string
 *                 description: Job offer description
 *               location:
 *                 type: string
 *                 description: Job location
 *               salary:
 *                 type: number
 *                 description: Job salary
 *     responses:
 *       200:
 *         description: Job offer successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/JobOffer'
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
jobOfferRouter.put('/:id', async (req, res) => {
  try {
    const recruiterId = req.user.id;
    const jobOfferId = parseInt(req.params.id, 10);
    const updatedJobOffer = await updateJobOffer(jobOfferId, recruiterId, req.body);
    res.json(updatedJobOffer);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * @swagger
 * /joboffers/{id}:
 *   delete:
 *     summary: Delete a job offer by ID
 *     tags: [JobOffer]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the job offer
 *     responses:
 *       200:
 *         description: Job offer successfully deleted
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
jobOfferRouter.delete('/:id', async (req, res) => {
  try {
    const recruiterId = req.user.id;
    const jobOfferId = parseInt(req.params.id, 10);
    const deletedJobOffer = await deleteJobOffer(jobOfferId, recruiterId);
    res.json(deletedJobOffer);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * @swagger
 * /joboffers:
 *   get:
 *     summary: Get all job offers
 *     tags: [JobOffer]
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
 *                 $ref: '#/components/schemas/JobOffer'
 *       400:
 *         description: Invalid request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
jobOfferRouter.get('/', async (req, res) => {
  try {
    const recruiterId = req.user.id;
    const jobOffers = await getAllJobOffers(recruiterId);
    res.json(jobOffers);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default jobOfferRouter;
