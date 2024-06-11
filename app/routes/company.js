//@ts-check
import express from 'express';
import { authenticateToken } from '../actions/auth.js';
import { createCompany, getCompanyById, updateCompany, deleteCompany, getAllCompanies } from '../actions/company.js';



const companyRouter = express.Router();

companyRouter.use(authenticateToken);

companyRouter.post('/add', async (req, res) => {
  try {
    const newCompany = await createCompany(req.body);
    res.json(newCompany);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

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