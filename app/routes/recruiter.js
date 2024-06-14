//@ts-check

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

// Register new recruit
/**
 * @swagger
 * /recruits/addRecruiter:
 *   post:
 *     summary: Register a new recruit
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
 *                 description: Recruiter's name
 *               lastName:
 *                 type: string
 *                 description: Recruiter's email
 *               email:
 *                 type: string
 *                 description: Recruiter's email
 *               password:
 *                 type: string
 *                 description: Recruiter's password
 *     responses:
 *       200:
 *         description: Recruit successfully registered
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: Recruit ID
 *                 name:
 *                   type: string
 *                   description: Recruit's name
 *                 email:
 *                   type: string
 *                   description: Recruit's email
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

// Register new recruiter
recruiterRouter.post('/addRecruiter', async (req, res) => {
  try {
    const newRecruiter = await registerRecruiter(req.body);
    res.json(newRecruiter);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Protected routes
recruiterRouter.use(authenticateToken);

// Routes below this middleware require authentication



// Get recruiter profile
recruiterRouter.get('/:recruiterId/profile', async (req, res) => {
  const recruiterId = parseInt(req.params.recruiterId);
  try {
    const recruiterProfile = await fetchRecruiterProfile(recruiterId);
    res.json(recruiterProfile);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

/**
 * @swagger
 * /recruiters/{recruitId}/profile:
 *   put:
 *     summary: Update Recruit profile
 *     tags: [Recruiter]
 *     parameters:
 *       - in: path
 *         name: recruitId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the recruit
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Recruit's name
 *               email:
 *                 type: string
 *                 description: Recruit's email
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

// Update recruiter profile
recruiterRouter.put('/:recruiterId/profile', async (req, res) => {
  const recruiterId = parseInt(req.params.recruiterId);
  try {
    const updatedProfile = await updateRecruiterProfile(recruiterId, req.body);
    res.json(updatedProfile);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete recruiter
/**
 * @swagger
 * /recruiters/{recruiterId}:
 *   delete:
 *     summary: Delete a recruit
 *     tags: [Recruiter]
 *     parameters:
 *       - in: path
 *         name: recruitId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the recruit
 *     responses:
 *       200:
 *         description: Recruit successfully deleted
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
