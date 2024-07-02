
import express from 'express';
import { createJobOffer, getJobOffer, updateJobOffer, deleteJobOffer, getAllJobOffers } from '../actions/joboffers.js';
import { authenticateToken } from '../actions/auth.js';

const jobOfferRouter = express.Router();

/**
 * @swagger
 * /jobOffers:
 *   get:
 *     summary: Get all job offers with optional filtering
 *     tags: [JobOffer]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         description: Filter by job offer title
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *         description: Filter by job offer location
 *       - in: query
 *         name: salaryRange
 *         schema:
 *           type: string
 *         description: Filter by job offer salary range
 *       - in: query
 *         name: company
 *         schema:
 *           type: string
 *         description: Filter by company name
 *       - in: query
 *         name: experience
 *         schema:
 *           type: string
 *         description: Filter by experience
 *     responses:
 *       200:
 *         description: A list of job offers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/JobOffer'
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

jobOfferRouter.get('/', async (req, res) => {
  try {
    const filters = req.query;
    console.log(filters)
    if(Object.keys(filters).length === 0){
      res.status(405).json({error:"A search parameter must exist while browsing Job Offers"});
    }
    const jobOffers = await getAllJobOffers(filters);
    res.json(jobOffers);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


jobOfferRouter.use(authenticateToken);

/**
 * @swagger
 * tags:
 *   - name: JobOffer
 *     description: API endpoints to manage job offers
 */

/**
 * @swagger
 * /joboffers/newJobOffer:
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
 *               expId:
 *                 type: number
 *                 description: Index Based Job Experience Id ["< 1 year", "1-2 years", "3-4 years", "5+ years"]
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

/**
 * @typedef {Object} User
 * @property {number} userId - The user ID
 * @property {string} role - The user's role
 */


jobOfferRouter.post('/newJobOffer', async (req, res) => {
  try { 
    if (!req.user || req.user.role !== "RECRUITER") {
      return res.status(403).json({ error: 'Unauthorized access' });
    }
    const recruiterId = parseInt(req.user.userId);
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
    if (!req.user || req.user.role !== "RECRUITER") {
      return res.status(403).json({ error: 'Unauthorized access' });
    }

    const recruiterId = req.user.id;
    const jobOfferId = parseInt(req.params.id, 10);
    const jobOffer = await getJobOffer(jobOfferId, recruiterId);

    if (!jobOffer) {
      return res.status(404).json({ error: 'Job offer not found' });
    }

    res.json(jobOffer);
  } catch (error) {
    res.status(500).json({ error: error.message });
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



export default jobOfferRouter;
