// recruitRouter.js

import express from 'express';
import { authenticateToken } from '../actions/auth.js';
import { registerRecruit, fetchRecruitProfile, updateRecruitProfile, deleteRecruit } from '../actions/recruit.js';

const recruitRouter = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Recruit
 *     description: API endpoints to manage recruits
 */

// Register new recruit
/**
 * @swagger
 * /recruits/addRecruit:
 *   post:
 *     summary: Register a new recruit
 *     tags: [Recruit]
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
 *                 description: Recruit's name
 *               lastName:
 *                 type: string
 *                 description: Recruit's email
 *               email:
 *                 type: string
 *                 description: Recruit's email
 *               password:
 *                  type: string
 *                  description: Recruit's password
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
recruitRouter.post('/addRecruit', async (req, res) => {
  try {
    const newRecruit = await registerRecruit(req.body);
    res.json(newRecruit);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Protected routes
recruitRouter.use(authenticateToken);

// Routes below this middleware require authentication

/**
 * @swagger
 * /recruits/{recruitId}/profile:
 *   get:
 *     summary: Get Recruit profile
 *     tags: [Recruit]
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
 *               $ref: '#/components/schemas/Profile'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
recruitRouter.get('/:recruitId/profile', async (req, res) => {
  const recruitId = parseInt(req.params.recruitId);
  try {
    const recruitProfile = await fetchRecruitProfile(recruitId);
    if (recruitProfile) {
      res.json(recruitProfile);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// Update recruit profile
/**
 * @swagger
 * /recruits/{recruitId}/profile:
 *   put:
 *     summary: Update Recruit profile
 *     tags: [Recruit]
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
recruitRouter.put('/:recruitId/profile', async (req, res) => {
  const recruitId = parseInt(req.params.recruitId);
  try {
    const updatedProfile = await updateRecruitProfile(recruitId, req.body);
    res.json(updatedProfile);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete recruit
/**
 * @swagger
 * /recruits/{recruitId}:
 *   delete:
 *     summary: Delete a recruit
 *     tags: [Recruit]
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
recruitRouter.delete('/:recruitId', async (req, res) => {
  const recruitId = parseInt(req.params.recruitId);
  try {
    await deleteRecruit(recruitId);
    res.json({ message: 'Recruit deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default recruitRouter;
