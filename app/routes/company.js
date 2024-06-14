//@ts-check
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
companyRouter.post('/addCompany', async (req, res) => {
  try {
    const newCompany = await createCompany(req.body);
    res.json(newCompany);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


/**
 * @swagger
 * /companies/{companyId}:
 *   post:
 *     summary: Get Company by Id
 *     tags: [Company]
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
 *               recruiterId:
 *                type: integer
 *                description: Recruiters Id
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
companyRouter.post('/:id', async (req, res) => {
  try {
    const {recruiterId, ...rest} = req.body
    const company = await getCompanyById(parseInt(req.params.id), recruiterId);
    res.json(company);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

companyRouter.put('/:id', async (req, res) => {
  try {
    const {recruiterId, ...rest} = req.body
    const updatedCompany = await updateCompany(parseInt(req.params.id), rest, recruiterId);
    res.json(updatedCompany);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

companyRouter.delete('/:id', async (req, res) => {
  try {
    const result = await deleteCompany(parseInt(req.params.id), req);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

companyRouter.get('/getAllCompanies', async (req, res) => {
  try {
    
    const companies = await getAllCompanies(req.user.userId);
    companies === "Unauthorized Access" ? res.status(404).json(companies) : res.json(companies);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default companyRouter;