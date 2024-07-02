

import express from 'express';
import { authenticateToken } from '../actions/auth.js';
import { createCompany, getCompanyById, updateCompany, deleteCompany, getAllCompanies } from '../actions/company.js';

const companyRouter = express.Router();



companyRouter.use(authenticateToken);

/**
 * @swagger
 * tags:
 *   - name: Company
 *     description: API endpoints to manage companies
 */

/**
 * @swagger
 * /companies/addCompany:
 *   post:
 *     summary: Register a new company
 *     tags: [Company]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Company Name
 *               industry:
 *                 type: string
 *                 description: Company Industry
 *               phoneNumber:
 *                 type: string
 *                 description: Company Phone Number
 *               emailAddress:
 *                 type: string
 *                 description: Company Email Address
 *               physicalAddress:
 *                 type: string
 *                 description: Company Physical Address
 *               website:
 *                  type: string
 *                  description: Company Website
 *     responses:
 *       200:
 *         description: Company successfully registered
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Company'
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
companyRouter.post('/addCompany', async (req, res) => {
  try {
    if (!req.user || req.user.role !== "RECRUITER") {
      return res.status(403).json({ error: 'Unauthorized access' });
    }
    const newCompany = await createCompany(req.body, parseInt(req.user.userId));
    //console.log(req.user)
    res.json(newCompany);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * @swagger
 * /companies/{id}:
 *   get:
 *     summary: Get Company by ID
 *     tags: [Company]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the company
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Company'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
companyRouter.get('/:id', async (req, res) => {
  try {
    const company = await getCompanyById(parseInt(req.params.id));
    res.json(company);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * @swagger
 * /companies/updateCompany/{id}:
 *   put:
 *     summary: Update a company
 *     tags: [Company]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the company
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               recruiterId:
 *                  type: integer
 *                  description: Recruiter ID
 *               name:
 *                 type: string
 *                 description: Company Name
 *               industry:
 *                 type: string
 *                 description: Company Industry
 *               phoneNumber:
 *                 type: string
 *                 description: Company Phone Number
 *               emailAddress:
 *                 type: string
 *                 description: Company Email Address
 *               address:
 *                 type: string
 *                 description: Company Physical Address
 *               website:
 *                  type: string
 *                  description: Company Website
 *     responses:
 *       200:
 *         description: Company successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Company'
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
companyRouter.put('/updateCompany/:id', async (req, res) => {
  try {
    const { recruiterId, ...rest } = req.body;
    const updatedCompany = await updateCompany(parseInt(req.params.id), rest, recruiterId);
    res.json(updatedCompany);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * @swagger
 * /companies/{id}:
 *   delete:
 *     summary: Delete a company
 *     tags: [Company]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the company
 *     responses:
 *       200:
 *         description: Company successfully deleted
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
companyRouter.delete('/:id', async (req, res) => {
  try {
    const result = await deleteCompany(parseInt(req.params.id));
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * @swagger
 * /companies:
 *   get:
 *     summary: Get all companies
 *     tags: [Company]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: A list of companies
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Company'
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

companyRouter.get('/', async (req, res) => {
  try {
    const companies = await getAllCompanies(req.user.userId);
    res.json(companies);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default companyRouter;
