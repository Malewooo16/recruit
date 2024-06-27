// @ts-check
import express from 'express';
import { authenticateToken } from '../actions/auth.js';
import { registerRecruiter, fetchRecruiterProfile, updateRecruiterProfile, deleteRecruiter } from '../actions/recruiter.js';

const recruiterRouter = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Recruiter
 *     description: API endpoints to manage recruiters
 */

/**
 * @swagger
 * /recruiters/addRecruiter:
 *   post:
 *     summary: Register a new recruiter
 *     tags: [Recruiter]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 description: Recruiter's first name
 *               lastName:
 *                 type: string
 *                 description: Recruiter's last name
 *               email:
 *                 type: string
 *                 description: Recruiter's email
 *               password:
 *                 type: string
 *                 description: Recruiter's password
 *     responses:
 *       200:
 *         description: Recruiter successfully registered
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: Recruiter ID
 *                 firstName:
 *                   type: string
 *                   description: Recruiter's first name
 *                 lastName:
 *                   type: string
 *                   description: Recruiter's last name
 *                 email:
 *                   type: string
 *                   description: Recruiter's email
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
recruiterRouter.post('/addRecruiter', async (req, res) => {
  try {
    const newRecruiter = await registerRecruiter(req.body);
    res.json(newRecruiter);
  } catch (error) {
    if (error.message === 'Email already exists') {
      return res.status(400).json({ error: 'Email already exists' });
    }
    console.error('Error registering recruiter:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Protected routes
recruiterRouter.use(authenticateToken);

/**
 * @swagger
 * /recruiters/{recruiterId}/profile:
 *   get:
 *     summary: Get recruiter profile
 *     tags: [Recruiter]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: recruiterId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the recruiter
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Profile'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
recruiterRouter.get('/:recruiterId/profile', async (req, res) => {
  const recruiterId = parseInt(req.params.recruiterId);
  try {
    const recruiterProfile = await fetchRecruiterProfile(recruiterId);
    if(recruiterProfile)
    res.json(recruiterProfile);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

/**
 * @swagger
 * /recruiters/{recruiterId}/profile:
 *   put:
 *     summary: Update recruiter profile
 *     tags: [Recruiter]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: recruiterId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the recruiter
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 description: Recruiter's first name
 *               lastName:
 *                 type: string
 *                 description: Recruiter's last name
 *               email:
 *                 type: string
 *                 description: Recruiter's email
 *     responses:
 *       200:
 *         description: Profile successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Profile'
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
recruiterRouter.put('/:recruiterId/profile', async (req, res) => {
  const recruiterId = parseInt(req.params.recruiterId);
  try {
    const updatedProfile = await updateRecruiterProfile(recruiterId, req.body);
    res.json(updatedProfile);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * @swagger
 * /recruiters/{recruiterId}:
 *   delete:
 *     summary: Delete a recruiter
 *     tags: [Recruiter]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: recruiterId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the recruiter
 *     responses:
 *       200:
 *         description: Recruiter successfully deleted
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
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
recruiterRouter.delete('/:recruiterId', async (req, res) => {
  const recruiterId = parseInt(req.params.recruiterId);
  try {
    await deleteRecruiter(recruiterId);
    res.json({ message: 'Recruiter deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default recruiterRouter;
